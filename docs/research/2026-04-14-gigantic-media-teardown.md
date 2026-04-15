# Site Teardown: Gigantic Media

**URL:** https://giganticmedia.net/
**Built by:** Forwwward Studio (www.forwwward.studio)
**Platform:** Webflow (with custom JS/CSS layer hosted on forwwward.studio)
**Date analyzed:** 2026-04-14

## Tech Stack (Confirmed from Source)

| Technology | Evidence | Purpose |
|---|---|---|
| Webflow | `data-wf-site` attribute, `.w-` class prefix | CMS and hosting platform |
| GSAP 3.11.5 | `<script src="cdnjs.cloudflare.com/.../gsap.min.js">` | Core animation engine |
| ScrollTrigger 3.11.3 | Separate GSAP plugin script tag | Scroll-linked animations |
| MotionPathPlugin 3.12.2 | Separate GSAP plugin script tag | Path-based animations (orbit elements) |
| SplitType | `<script src="unpkg.com/split-type">` | Character/word-level text splitting for reveals |
| Lenis 1.3.4 | Script + CSS from unpkg | Smooth scrolling |
| Swiper 11 | CDN bundle (JS + CSS) | Slider/carousel components |
| FancyBox 5.0 | `@fancyapps/ui` from CDN | Lightbox/media viewing |
| jQuery 3.5.1 | Webflow default | DOM manipulation, form validation |
| jQuery Validate 1.15 | CDN script | Contact form validation |
| Finsweet Attributes | `@finsweet/attributes@2` + CMS filter | CMS filtering/list management |
| Google Tag Manager | GTM-K5RRKPC8 | Analytics |
| Suisse Intl | @font-face in Webflow CSS | Primary typeface |

## Design System

### Colors

| Name/Usage | Value |
|---|---|
| Primary (muted pink) | `#ae9ea1` |
| Secondary / Accent Red | `#e85b54` |
| Light (cream/background) | `#f0e7e9` |
| Dark (near-black) | `#2a2a2a` |
| Text Secondary Light | `#6f6769` |
| Text Secondary Dark | `#989091` |
| Lines Light | `#d4cacc` |
| Lines Dark | `#5a5052` |
| Nav Lines over White | `#ae9ea1a8` (with alpha) |
| Nav Lines over Dark | `#f0e7e929` (with alpha) |
| Form Input BG | `#ffffff1a` (white 10% alpha) |
| Form Placeholder | `#f0e7e980` (50% alpha) |
| Preloader BG | `#15171a` |
| Button Hover | `#404040` |
| Adv Box BG | `#2a2a2a14` (dark 8% alpha) |

### Typography

| Role | Font Family | Weight | Letter-spacing | Sizes |
|---|---|---|---|---|
| All text | Suisse Intl, Verdana, sans-serif | 400 (body), 500 (headings) | normal (body) | Base: 1rem |
| H1 / .heading-style-h1 | Suisse Intl | 500 | -0.04em | 5rem (desktop) |
| H2 / .heading-style-h2 | Suisse Intl | 500 | -0.03em | 4.5rem (desktop) |
| H3 / .heading-style-h3 | Suisse Intl | 500 | -0.02em | 2rem |
| H4 / .heading-style-h4 | Suisse Intl | 500 | -0.01em | 1.5rem |
| Text sizes | Suisse Intl | 400 | normal | tiny=0.75rem, small=1rem, medium=1.25rem, large=1.5rem, huge=2rem, xxxhuge=3.25rem |

Font files: Webflow-hosted SuisseIntl-Medium.woff2 and SuisseIntl-Regular.woff2

Fluid font sizing via inline `<style>`:
```css
html { font-size: 1.125rem; }
@media (max-width:1920px) { html { font-size: calc(0.625rem + 0.41667vw); } }
@media (max-width:1440px) { html { font-size: calc(0.8127rem + 0.20812vw); } }
@media (max-width:479px)  { html { font-size: calc(0.7495rem + 0.83682vw); } }
```

### Spacing System

CSS utility classes from 0.125rem to 12rem:
- `padding-global`: 4rem horizontal padding
- `padding-section-large`: 8rem vertical padding
- `padding-section-medium`: 5rem vertical
- `padding-section-small`: 3rem vertical
- Gaps: 0.125rem to 11.875rem via `.gap_N` classes

### Responsive Approach

Breakpoints:
- Desktop: > 991px
- Tablet: <= 991px (container max 728px)
- Mobile Landscape: <= 767px (columns go full-width)
- Mobile: <= 479px (no max container)

Fluid typography via calc() at each breakpoint.

## Effects Breakdown

| Effect | Implementation | Complexity | Cloneable? |
|---|---|---|---|
| Preloader overlay | Fixed black overlay, fades out via GSAP on "Enter" click | Low | Yes |
| Loading screen circle | Animated border with orbit dot, GSAP rotation | Med | Yes |
| Hero title fixed | `position: fixed` SVG logo, scales/fades on scroll | Low | Yes |
| Text zoom-in sections | ScrollTrigger scrubs scale on heading text | Med | Yes |
| Circle mask zoom | Large circle (96vw) with colored masks, rotates -45deg, ScrollTrigger reveals | High | Partially |
| Cheese slice service wheel | 16 radial dividers from circle center, each rotated 22.5deg, content along lines | High | Hard |
| Line glitch effect | Elements with `.glitch` class get periodic visual distortion | Med | Yes (inferred) |
| Sound wave canvas | `<canvas id="wave">` in navbar, audio visualization on hover | Med | Yes |
| Background audio | Looping ambient track, toggled by navbar button | Low | Yes |
| Hover sound | Short audio clip on interactive element hover | Low | Yes |
| Box row carousel | Line boxes with aspect-ratio 400/180, positioned absolutely, scroll-animated | Med | Partially |
| Advantage boxes | Backdrop-filter blur(8px) glassmorphism | Low | Yes |
| Menu overlay | Full-screen red gradient + "G" letter SVG overlay, slide-in navigation | Med | Yes |
| Menu link glow | White blurred circle appears on hover, link slides right with padding transition | Low | Yes |
| Orbit dot animation | Red blurred dot orbits circle borders continuously | Med | Yes |
| Intersection observer text | Two sequential sections with text that zooms in as you scroll through | Med | Yes |
| Contact form | Dark section, transparent-bg inputs, minimal styling | Low | Yes |
| Decorative lines | Horizontal/vertical/diagonal lines with corner dots (red blurred circles) | Low | Yes |
| Hamburger menu animation | Two lines rotate to X on open | Low | Yes |

## Implementation Details

### Color Philosophy
The site uses a warm, muted palette: cream (#f0e7e9) as primary light, near-black (#2a2a2a) as dark, and a coral red (#e85b54) as the only accent. Everything else is derived - muted pinks, grays with warm undertones. This creates a sophisticated, non-generic feel.

### Circle/Wheel Service Section
The most complex visual element. A 96vw circle with `border-radius: 100%` serves as the base. 16 child elements are positioned at the center and rotated in 22.5-degree increments to create radial "slice" lines. Service content sits along these lines. The entire section is rotated -45deg. Colored circle masks (dark, light, red) expand via ScrollTrigger to create reveal transitions. A `rect_mask` covers the bottom half.

### Glassmorphism Advantage Boxes
```css
.adv_box.text-size-large {
  background-color: #2a2a2a14;  /* 8% opacity dark */
  backdrop-filter: blur(8px);
  padding: .5rem .75rem;
  font-weight: 500;
}
```

### Button Pattern
Two-line strip animation for hover:
```html
<div class="btn-viewport">
  <div class="btn-strip">
    <div class="btn-line">Get in touch</div>
    <div class="btn-line">Get in touch</div>
  </div>
</div>
```
The strip translates vertically on hover, revealing the second line - creates a "rolling text" effect.

### Decorative Dot System
Red (#e85b54) circles with `filter: blur(2px-5px)` placed at line intersections and orbit paths. Sizes: 0.5rem (small), 1.2rem (medium), 1.375rem (large). These give the geometric elements a soft, glowing quality.

## Assets Needed to Recreate

1. **Font**: Suisse Intl (commercial license) — Alternative: Inter, DM Sans, or Instrument Sans (free)
2. **Background images**: The calculator already has imgc.jpg, imgl.jpg, imgr.jpg (game art)
3. **SVG decorations**: Simple circles, lines — generate with code
4. **Noise/grain texture**: Not used on this site (clean surfaces)

## Build Plan for Calculator Redesign

### Recommended Stack (Keeping existing)
- **Bootstrap 5.3.8**: Already in use, override with custom CSS
- **jQuery**: Already in use for calculator logic
- **Custom CSS**: New stylesheet with Gigantic Media design tokens
- **GSAP** (optional): For subtle entrance animations

### Adaptation Strategy

The calculator is a tool, not a marketing site. Adapt the **aesthetic** (colors, typography, spacing, decorative elements) while keeping the **interaction patterns** appropriate for a data-heavy tool.

**Keep from Gigantic Media:**
- Dark theme color palette (#2a2a2a bg, #f0e7e9 text, #e85b54 accents)
- Clean typography with tight heading letter-spacing
- Glassmorphism cards (backdrop-filter: blur)
- Decorative line system with glowing dots
- Button styling with dark/light variants
- Form input styling (transparent bg, subtle borders)

**Skip (not appropriate for calculator):**
- Scroll-based animations (single-page tool)
- Full-screen sections (data density matters)
- Circle/wheel diagram (not relevant)
- Sound effects
- Preloader
- Smooth scroll library

### Section-by-Section Build Order

**1. Base Theme**
- CSS custom properties matching Gigantic Media palette
- Font stack (Inter or DM Sans as free Suisse Intl alternative)
- Body dark background
- Fluid typography scale

**2. Header/Title Area**
- Game title with tight letter-spacing
- Accent color on version badge
- Decorative horizontal line with glowing dot

**3. Data Tables (Source + Target)**
- Semi-transparent glass cards as table containers
- Dark headers with cream text
- Subtle row hover with warm tint
- Clean cell borders using lines-dark color
- Status badges with accent red

**4. Offcanvas Panels**
- Dark overlay background
- Glass-effect panel body
- Styled select dropdowns
- Accent-colored submit buttons

**5. Summary/Results Area**
- Accent-bordered result card
- Clean data presentation
- Action buttons with rolling-text hover effect

**6. Decorative Layer**
- Corner dots at section intersections
- Thin decorative lines framing content
- Subtle backdrop blur on key containers
