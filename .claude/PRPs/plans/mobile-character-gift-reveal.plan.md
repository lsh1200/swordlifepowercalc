# Plan: Mobile Character Gift Reveal

## Summary
On mobile, reposition 玄鈺 as a centered, prominent element. The turtle/ornament in her cupped hands becomes a glowing tappable button. When results are ready, user taps the turtle to reveal them. Results overlay her body area (semi-transparent) while her head remains visible above. New calculations re-wrap the gift.

## User Story
As a mobile gamer using the calculator, I want 玄鈺 to present my results like a gift I can open, so that the experience feels connected to the game instead of being a plain text dump.

## Problem → Solution
Character dumped at page bottom, disconnected → Character centered with interactive gift reveal mechanic

## Metadata
- **Complexity**: Medium
- **Source PRD**: `.claude/PRPs/prds/mobile-character-gift-reveal.prd.md`
- **PRD Phase**: Phase 1-4 (all phases in one pass — tightly coupled)
- **Estimated Files**: 3 (index.html, css/styles.css, js/snp.js)

---

## UX Design

### Before (Mobile)
```
┌──────────────────────┐
│  [Source Table]       │
│  [Target Table]       │
│  [Results text]       │
│                       │
│  [Character - awkward │
│   just head visible]  │
│                       │
│  [Footer]             │
└──────────────────────┘
```

### After (Mobile)
```
STATE 1: Gift wrapped (after computation)
┌──────────────────────┐
│  [Source Table]       │
│  [Target Table]       │
│                       │
│    ┌──────────┐       │
│    │ 玄鈺 head│       │
│    │  body    │       │
│    │          │       │
│    │  ✨🐢✨  │ ← tap │
│    │  hands   │       │
│    └──────────┘       │
│  [Footer]             │
└──────────────────────┘

STATE 2: Gift opened (after tap)
┌──────────────────────┐
│  [Source Table]       │
│  [Target Table]       │
│                       │
│    ┌──────────┐       │
│    │ 玄鈺 head│ ← visible
│    ├──────────┤       │
│    │ Results  │ ← semi-transparent
│    │ overlay  │   see silhouette
│    │ on body  │   through text
│    └──────────┘       │
│  [Footer]             │
└──────────────────────┘
```

### Interaction Changes
| Touchpoint | Before | After | Notes |
|---|---|---|---|
| Results display | Immediate text in `#tsum` | Hidden → tap turtle → reveal | Mobile only |
| Character position | Bottom of page, disconnected | Centered, prominent, interactive | Mobile only |
| New calculation | Text updates silently | Gift re-wraps, tap again | Engaging loop |
| Desktop | No change | No change | Untouched |

---

## Mandatory Reading

| Priority | File | Lines | Why |
|---|---|---|---|
| P0 | `css/styles.css` | 477-546 | `.report-row` and `.character-panel` layout + mobile override |
| P0 | `js/snp.js` | 648-847 | `computesuperpower()` — writes results to `#tsum` |
| P0 | `js/character-live2d.js` | 1-227 | PixiJS canvas, sizing, sprite positioning |
| P1 | `index.html` | 171-178 | `.report-row` HTML structure |
| P1 | `js/character-live2d.js` | 56-58 | Eye positions (normalized coords pattern for turtle) |
| P2 | `js/character-live2d.js` | 88-98 | `fitSprite()` — how sprite scales to panel |

---

## Patterns to Mirror

### RESULT_WRITING
```js
// SOURCE: js/snp.js:843-846
if (hasDeficit) {
    $('#tsum')[0].innerHTML = deficitHtml + "<br />" + conversionHtml + "<br />" + remainderHtml;
} else {
    $('#tsum')[0].innerHTML = conversionHtml + "<br />" + deficitHtml + "<br />" + remainderHtml;
}
```

### MUTATION_OBSERVER
```js
// SOURCE: js/character-live2d.js:221-226
var tsum = document.getElementById('tsum');
if (tsum) {
    new MutationObserver(function () {
        setTimeout(fitSprite, 50);
    }).observe(tsum, { childList: true, subtree: true, characterData: true });
}
```

### NORMALIZED_POSITIONS
```js
// SOURCE: js/character-live2d.js:57-58
var leftEyePos  = { x: 210/591, y: 215/848, w: 90/591, h: 50/848 };
var rightEyePos = { x: 320/591, y: 213/848, w: 85/591, h: 50/848 };
```

### CSS_MOBILE_OVERRIDE
```css
/* SOURCE: css/styles.css:536-546 */
@media (max-width: 767px) {
  .report-row {
    flex-direction: column;
  }
  .character-panel {
    flex: 0 0 auto;
    height: 200px;
    min-height: 200px;
  }
}
```

### ANIMATION_STYLE
```css
/* SOURCE: css/styles.css:59-62 */
--transition-fast: 150ms ease-out;
--transition-normal: 250ms ease-out;
--transition-slow: 400ms ease-out;
```

---

## Files to Change

| File | Action | Justification |
|---|---|---|
| `index.html` | UPDATE | Add gift tap target element inside `.character-panel`, bump CSS version |
| `css/styles.css` | UPDATE | Mobile character repositioning, gift glow animation, result reveal styles |
| `js/snp.js` | UPDATE | Hook `computesuperpower()` to trigger gift state, handle tap reveal |

## NOT Building

- Desktop version of gift reveal
- New character artwork or turtle asset
- Sound effects
- Skip/bypass button
- Particle effects

---

## Step-by-Step Tasks

### Task 1: Add gift tap target HTML
- **ACTION**: Add a clickable overlay element inside `.character-panel` in `index.html`
- **IMPLEMENT**:
  ```html
  <!-- inside .character-panel, after canvas -->
  <div id="giftTap" class="gift-tap" style="display:none">
    <span class="gift-tap-label">點擊打開</span>
  </div>
  ```
- **MIRROR**: Existing HTML structure in `index.html:171-178`
- **GOTCHA**: Must be AFTER the canvas in DOM order so it sits on top via z-index
- **VALIDATE**: Element visible in DOM inspector

### Task 2: CSS — Mobile character repositioning
- **ACTION**: In the `@media (max-width: 767px)` block, restyle `.report-row` and `.character-panel` so character is centered, full body visible
- **IMPLEMENT**:
  ```css
  @media (max-width: 767px) {
    .report-row {
      flex-direction: column-reverse; /* character above results */
      align-items: center;
      position: relative;
    }

    .character-panel {
      flex: 0 0 auto;
      width: 260px;
      height: 380px;
      min-height: 380px;
      margin-top: 0;
      /* Remove the radial mask on mobile — show full character */
      -webkit-mask-image: none;
      mask-image: none;
    }
  }
  ```
- **MIRROR**: `CSS_MOBILE_OVERRIDE` pattern
- **GOTCHA**: Remove the radial `mask-image` on mobile so full body + hands visible. Keep it on desktop.
- **VALIDATE**: On 375px viewport, character visible from head to hands, centered

### Task 3: CSS — Gift tap target styling + pulse animation
- **ACTION**: Style the tap target as a glowing circle positioned over the turtle area
- **IMPLEMENT**:
  ```css
  .gift-tap {
    position: absolute;
    /* Turtle is at ~50% x, ~85% y of the character image */
    bottom: 8%;
    left: 50%;
    transform: translateX(-50%);
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(232,91,84,0.3) 0%, transparent 70%);
    border: 2px solid rgba(232,91,84,0.5);
    cursor: pointer;
    z-index: 10;
    animation: giftPulse 2s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gift-tap-label {
    color: var(--accent-primary);
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    text-shadow: 0 1px 4px rgba(0,0,0,0.8);
    pointer-events: none;
  }

  @keyframes giftPulse {
    0%, 100% { box-shadow: 0 0 8px var(--accent-glow); transform: translateX(-50%) scale(1); }
    50% { box-shadow: 0 0 24px var(--accent-glow); transform: translateX(-50%) scale(1.1); }
  }

  /* Hide gift tap on desktop */
  @media (min-width: 768px) {
    .gift-tap { display: none !important; }
  }
  ```
- **MIRROR**: `ANIMATION_STYLE` pattern for transitions
- **GOTCHA**: `pointer-events: none` on the label so tap registers on parent
- **VALIDATE**: Glowing circle visible over turtle area, pulses

### Task 4: CSS — Results reveal state
- **ACTION**: Style `#tsum` for the mobile reveal: initially hidden, overlays character body when revealed, semi-transparent to show silhouette
- **IMPLEMENT**:
  ```css
  @media (max-width: 767px) {
    /* Results overlay on character — initially hidden */
    .report-row #tsum {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      max-height: 55%; /* face starts ~18% down image; 55% from bottom clears face */
      overflow-y: auto;
      background: rgba(26, 26, 30, 0.82) !important;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 5;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.4s ease-out, transform 0.4s ease-out;
      pointer-events: none;
    }

    .report-row #tsum.revealed {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* When gift is wrapped, hide results even if they have content */
    .report-row.gift-wrapped #tsum {
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }
  }
  ```
- **MIRROR**: `ANIMATION_STYLE` for transition durations
- **GOTCHA**: Head is NOT at top of image — face starts ~18% down, eyes at ~25%. Use `max-height: 55%` (not 70%) so overlay covers hands+torso but face/expression stays visible above. Fine-tune during QA. The `0.82` opacity on background lets silhouette show through.
- **VALIDATE**: Results not visible until `.revealed` class added

### Task 5: JS — Gift state management in snp.js
- **ACTION**: At the end of `computesuperpower()`, after writing to `#tsum`, trigger the gift-wrapped state on mobile
- **IMPLEMENT**: Add after line 846 (after the `$('#tsum')[0].innerHTML = ...` block):
  ```js
  // Gift reveal on mobile
  if (window.innerWidth < 768) {
    var reportRow = document.querySelector('.report-row');
    var giftTap = document.getElementById('giftTap');
    var tsumEl = document.getElementById('tsum');
    if (reportRow && giftTap && tsumEl) {
      // Re-wrap: reset to gift state
      reportRow.classList.add('gift-wrapped');
      tsumEl.classList.remove('revealed');
      giftTap.style.display = 'flex';

      // One-time tap handler (remove previous to avoid stacking)
      giftTap.onclick = function() {
        giftTap.style.display = 'none';
        reportRow.classList.remove('gift-wrapped');
        tsumEl.classList.add('revealed');
      };
    }
  }
  ```
- **MIRROR**: `RESULT_WRITING` pattern — append after the innerHTML writes
- **IMPORTS**: None — uses vanilla DOM APIs already in use throughout snp.js
- **GOTCHA**: Must remove previous onclick to prevent stacking. Using `onclick =` (assignment) instead of `addEventListener` handles this automatically. Check `window.innerWidth` not CSS media query since JS needs the check.
- **VALIDATE**: After saving skills on mobile: gift appears → tap → results reveal

### Task 6: CSS version bump
- **ACTION**: Bump `?v=` in `index.html` link tag
- **IMPLEMENT**: Change `css/styles.css?v=70` to `css/styles.css?v=71`
- **VALIDATE**: Hard refresh loads new CSS

---

## Testing Strategy

### Manual Tests

| Test | Steps | Expected |
|---|---|---|
| Gift appears on mobile | Edit skills → save → check mobile layout | 玄鈺 centered, glowing turtle tap target visible |
| Tap reveals results | Tap the glowing circle | Results fade in over body, head visible above |
| Results semi-transparent | Look through results text | Can see character silhouette behind text |
| Re-wrap on new calc | Edit skills again → save | Gift re-wraps, must tap again |
| Desktop unchanged | Check on >768px viewport | Original side-by-side layout, no gift mechanic |
| Empty state | No calculation yet | Character hidden (existing `:has()` rule) |

### Edge Cases Checklist
- [ ] Very long results text — `overflow-y: auto` handles scrolling within overlay
- [ ] Rapid save-save-save — each save re-wraps, only latest results shown
- [ ] Screen rotation — `resize` event triggers `fitSprite()`, layout adjusts
- [ ] 320px width — character still fits, tap target still reachable
- [ ] 414px width — no overflow

---

## Validation Commands

### Browser Validation
```bash
# Start dev server
python3 -m http.server 8765
```
EXPECT: Open on phone or Chrome DevTools mobile emulation, test full flow

### Manual Validation
- [ ] Mobile 375px: gift flow works end to end
- [ ] Mobile 320px: no overflow, tap target reachable
- [ ] Mobile 414px: looks good
- [ ] Desktop 1440px: no changes, side-by-side layout intact
- [ ] Character head visible above results overlay
- [ ] Silhouette visible through semi-transparent results
- [ ] Pulse animation smooth (no jank)
- [ ] Re-wrap works on consecutive calculations

---

## Acceptance Criteria
- [ ] On mobile, character is centered with full body visible
- [ ] Glowing tap target visible on turtle/ornament area
- [ ] Tap reveals results with smooth animation
- [ ] Results semi-transparent — character silhouette visible
- [ ] Head visible above results overlay
- [ ] New calculation re-wraps the gift
- [ ] Desktop layout completely unchanged
- [ ] No new dependencies added

## Completion Checklist
- [ ] All changes on `dev` branch (not main)
- [ ] CSS version bumped
- [ ] No console.log statements
- [ ] Compositor-friendly animations only (opacity, transform)
- [ ] Works on Android Chrome + iOS Safari

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Tap target misaligned on different phones | Medium | Medium | Use percentage positioning relative to panel, not pixel |
| PixiJS canvas z-index conflicts | Low | High | Gift tap has z-index: 10, canvas stays default |
| Results too long, covers character entirely | Medium | Low | max-height: 70% + overflow-y: auto |
| Existing MutationObserver interferes | Low | Medium | Observer calls fitSprite which is fine — character just resizes |

## Notes
- The character image is 591x848. Key landmarks:
  - Horns/hair top: ~y=0 (0%)
  - Face/eyes: ~y=130-260 (15-30%)
  - Torso: ~y=300-550 (35-65%)
  - Hands + turtle: ~y=650-800 (77-95%)
  - Turtle/ornament center: approximately (295, 760) — center-x, ~90% down
- Results overlay must NOT cover the face. `max-height: 55%` from bottom leaves the top 45% (face+hair) visible. Fine-tune during QA.
- The `fitSprite()` function in character-live2d.js handles resize and is called via MutationObserver when `#tsum` changes. This will fire during reveal — which is fine, it just keeps the canvas sized correctly.
- The existing `:has()` CSS rule (`.report-row:not(:has(#tsum:not(:empty))) .character-panel { display: none; }`) hides character when no results exist. This still works because `#tsum` is empty before first calculation.
- All animations use `opacity` and `transform` only — compositor-friendly, no layout thrashing.
