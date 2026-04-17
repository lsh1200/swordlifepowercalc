"""One-shot asset pipeline for test.html character.

Inputs (3 renders at repo root, 1024x1536 RGB, opaque black bg):
  - file_000000005e287208bfd241384fdec350.png  (eyes OPEN)
  - file_00000000cc4c7208a7d58fbdbd312413.png  (eyes HALF-closed)
  - file_0000000049e472089c65e1330ae81a8a.png  (eyes CLOSED)

Outputs:
  - assets/images/character-clean.png   full-body bg-stripped open-eye render
  - assets/images/eye-half-closed.png   eye-region overlay, soft-masked on diff
  - assets/images/eye-closed.png        eye-region overlay, soft-masked on diff

Also prints the normalized eye-region rect for paste into character-live2d-test.js.
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageFilter, ImageChops
from rembg import remove, new_session

ROOT = Path(__file__).resolve().parents[1]
SRC_OPEN   = ROOT / "file_000000005e287208bfd241384fdec350.png"
SRC_HALF   = ROOT / "file_00000000cc4c7208a7d58fbdbd312413.png"
SRC_CLOSED = ROOT / "file_0000000049e472089c65e1330ae81a8a.png"

ASSETS = ROOT / "assets" / "images"
CHAR_OUT   = ASSETS / "character-clean.png"
HALF_OUT   = ASSETS / "eye-half-closed.png"
CLOSED_OUT = ASSETS / "eye-closed.png"

# Coarse search window for eye region (avoids false positives from body differences).
# Measured from probe thumbnails: eyes sit roughly y=220-290, x=380-620 in 1024x1536.
EYE_SEARCH = (390, 230, 640, 300)  # (left, top, right, bottom)

# Diff threshold for eye mask (sum of RGB deltas per pixel). Higher => only strong eye changes.
DIFF_THRESHOLD = 45
MASK_DILATE_PX = 3
MASK_BLUR_PX   = 5


def strip_bg(src: Path, session) -> Image.Image:
    data = src.read_bytes()
    out = remove(data, session=session)
    return Image.open(Image.io.BytesIO(out)) if hasattr(Image, "io") else Image.open(__import__("io").BytesIO(out))


def diff_mask(overlay_rgba: Image.Image, base_rgba: Image.Image) -> Image.Image:
    """Return a soft 8-bit alpha mask where overlay differs from base in RGB."""
    # Compare on RGB only; both images are same-size RGBA.
    overlay_rgb = overlay_rgba.convert("RGB")
    base_rgb    = base_rgba.convert("RGB")
    diff = ImageChops.difference(overlay_rgb, base_rgb)
    # Sum-of-abs-diffs per pixel -> grayscale.
    r, g, b = diff.split()
    summed = ImageChops.add(ImageChops.add(r, g), b)
    # Threshold -> binary L mask.
    thresholded = summed.point(lambda v: 255 if v >= DIFF_THRESHOLD else 0, mode="L")
    # Dilate (MaxFilter) then blur for soft feathered edges.
    dilated = thresholded.filter(ImageFilter.MaxFilter(MASK_DILATE_PX * 2 + 1))
    blurred = dilated.filter(ImageFilter.GaussianBlur(radius=MASK_BLUR_PX))
    return blurred


def crop_to_mask_bbox(overlay_rgba: Image.Image, mask: Image.Image, search_box: tuple[int, int, int, int]) -> tuple[Image.Image, tuple[int, int, int, int]]:
    """Crop overlay+mask to bbox of mask pixels inside search_box (with padding)."""
    # Restrict mask to search box to avoid body/hair noise.
    limited = Image.new("L", mask.size, 0)
    limited.paste(mask.crop(search_box), search_box[:2])
    bbox = limited.getbbox()
    if not bbox:
        raise RuntimeError("diff mask empty within search box")
    pad = 12
    left   = max(0, bbox[0] - pad)
    top    = max(0, bbox[1] - pad)
    right  = min(mask.size[0], bbox[2] + pad)
    bottom = min(mask.size[1], bbox[3] + pad)
    tight = (left, top, right, bottom)
    cropped_rgba = overlay_rgba.crop(tight).convert("RGBA")
    cropped_mask = limited.crop(tight)
    # Apply mask as alpha.
    r, g, b, _ = cropped_rgba.split()
    out = Image.merge("RGBA", (r, g, b, cropped_mask))
    return out, tight


def main() -> int:
    for src in (SRC_OPEN, SRC_HALF, SRC_CLOSED):
        if not src.exists():
            print(f"[!] missing: {src}", file=sys.stderr)
            return 1
    ASSETS.mkdir(parents=True, exist_ok=True)

    print("[1/4] Loading rembg session (isnet-anime for clean anime matting)")
    session = new_session("isnet-anime")

    print("[2/4] Removing black bg from 3 source frames")
    open_rgba   = strip_bg(SRC_OPEN, session)
    half_rgba   = strip_bg(SRC_HALF, session)
    closed_rgba = strip_bg(SRC_CLOSED, session)
    print(f"      open:   {open_rgba.size} {open_rgba.mode}")
    print(f"      half:   {half_rgba.size} {half_rgba.mode}")
    print(f"      closed: {closed_rgba.size} {closed_rgba.mode}")

    print(f"[3/4] Writing {CHAR_OUT.relative_to(ROOT)}")
    open_rgba.save(CHAR_OUT, optimize=True)

    print("[4/4] Building eye-region overlays via diff-mask")
    half_mask   = diff_mask(half_rgba,   open_rgba)
    closed_mask = diff_mask(closed_rgba, open_rgba)

    half_crop,   half_box   = crop_to_mask_bbox(half_rgba,   half_mask,   EYE_SEARCH)
    closed_crop, closed_box = crop_to_mask_bbox(closed_rgba, closed_mask, EYE_SEARCH)

    # Use the union bbox so both overlays share the same rect (aligned at render time).
    union = (
        min(half_box[0], closed_box[0]),
        min(half_box[1], closed_box[1]),
        max(half_box[2], closed_box[2]),
        max(half_box[3], closed_box[3]),
    )
    print(f"      half bbox:   {half_box}")
    print(f"      closed bbox: {closed_box}")
    print(f"      union bbox:  {union}")

    # Re-crop both to union for pixel-aligned overlays.
    def recrop(rgba: Image.Image, mask: Image.Image) -> Image.Image:
        tight = rgba.crop(union).convert("RGBA")
        m = Image.new("L", mask.size, 0)
        m.paste(mask.crop(EYE_SEARCH), EYE_SEARCH[:2])
        m = m.crop(union)
        r, g, b, _ = tight.split()
        return Image.merge("RGBA", (r, g, b, m))

    half_out   = recrop(half_rgba,   half_mask)
    closed_out = recrop(closed_rgba, closed_mask)
    half_out.save(HALF_OUT, optimize=True)
    closed_out.save(CLOSED_OUT, optimize=True)
    print(f"      wrote {HALF_OUT.relative_to(ROOT)} ({half_out.size})")
    print(f"      wrote {CLOSED_OUT.relative_to(ROOT)} ({closed_out.size})")

    # Print normalized rect for JS constants.
    W, H = open_rgba.size
    l, t, r_, b_ = union
    print("\n--- paste into js/character-live2d-test.js ---")
    print(f"// union eye-region on {W}x{H} base")
    print(f"var eyeRegionPos = {{ x: {l}/{W}, y: {t}/{H}, w: {r_ - l}/{W}, h: {b_ - t}/{H} }};")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
