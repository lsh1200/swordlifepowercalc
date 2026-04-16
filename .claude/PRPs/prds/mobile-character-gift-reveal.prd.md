# Mobile Character Gift Reveal

## Problem Statement

On mobile, the 玄鈺 character renders at the very bottom of the page, disconnected from the UI. She has no purpose there — just an awkward afterthought. Meanwhile, the calculation results appear as plain text with no delight. For a game calculator used primarily by mobile gamers, this is a missed opportunity for personality.

## Evidence

- Screenshot confirms character is dumped at page bottom on mobile, only head visible
- The game (問劍長生) is a mobile game — majority of users are on phones
- The character image already shows 玄鈺 with cupped hands holding a small object (turtle/ornament)
- GitHub Issue: #1

## Proposed Solution

On mobile, after the user saves changes and a calculation result is ready, 玄鈺 appears with the small turtle/ornament in her hands as a clickable "gift." The user taps it to reveal the calculation results — like a gacha/reward reveal. This turns a plain text dump into a delightful interaction that matches the game's personality.

## Key Hypothesis

We believe a gift-reveal interaction will make the mobile calculator feel more like the game it serves, for mobile gamers using the calculator.
We'll know we're right when users engage with the reveal (tap the gift) instead of being confused by it.

## What We're NOT Building

- Desktop version of this interaction — defer until mobile is validated
- New character artwork — reuse existing `character-clean.png`
- Complex particle/3D animations — keep it simple CSS/JS
- Sound effects — no audio

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Gift is tappable | 100% of attempts register | Manual QA on Android + iOS Safari |
| Results visible after tap | No broken layouts | Visual regression on 320, 375, 414px widths |
| No desktop regression | Desktop layout unchanged | Manual check |

## Open Questions

- [x] ~~Skip option~~ — No. Tap is the only way.
- [x] ~~After opening~~ — She stays. Report is semi-transparent so her silhouette is visible through it. Report only covers hand/body area, head stays visible above.
- [x] ~~Re-wrap~~ — Yes. New calculation resets to gift state.

---

## Users & Context

**Primary User**
- **Who**: Mobile gamer playing 問劍長生, using phone browser to calculate superpower fragment conversions
- **Current behavior**: Edits skills, saves, scrolls down past disconnected character to read plain text results
- **Trigger**: Taps "確定修改" (save) on any skill panel
- **Success state**: Sees 玄鈺 offering results, taps turtle, results appear — feels like the game

**Job to Be Done**
When I finish configuring my skills on mobile, I want to see results in a way that feels connected to the game, so I can enjoy the calculator as more than just a spreadsheet.

**Non-Users**
Desktop users — this feature is mobile-only for now.

---

## Solution Detail

### Core Capabilities (MoSCoW)

| Priority | Capability | Rationale |
|----------|------------|-----------|
| Must | Character renders behind/around the result area on mobile | Core visual change |
| Must | Turtle/ornament in hands is a visible, tappable target | Core interaction |
| Must | Tapping turtle reveals the calculation results | Core mechanic |
| Must | Clear visual hint that turtle is tappable (pulse/glow) | Discoverability |
| Should | Smooth reveal animation (results expand from hand area) | Polish |
| Should | Character only appears when results are ready | No empty state confusion |
| Could | Re-wrap animation when user makes new changes | Delight on repeat use |
| Won't | Desktop version | Defer to Phase 2 |
| Won't | New character art | Reuse existing assets |

### MVP Scope

1. On mobile (<768px), when `#tsum` has content:
   - Show 玄鈺 centered, large enough that hands are visible
   - Overlay a tappable hit area on the turtle/ornament position
   - Add pulse/glow animation on the hit area to signal "tap me"
   - Results (`#tsum`) initially hidden
2. On tap:
   - Hide the tap target
   - Reveal `#tsum` results with a simple expand/fade animation
   - Position results overlaying the hand area

### User Flow

```
1. User opens calculator on phone
2. Edits source/target skills via offcanvas panels
3. Taps "確定修改" → computation runs, #tsum gets innerHTML
4. Mobile layout shows 玄鈺 with glowing turtle in hands
5. User taps turtle
6. Results expand/fade in over the hand area
7. User reads results, scrolls normally
```

---

## Technical Approach

**Feasibility**: HIGH

**Architecture Notes**
- Character is a PixiJS canvas (`#charCanvas`) inside `.character-panel`
- Turtle tap target: HTML overlay element positioned over the hand area (simpler than PixiJS hit detection)
- Results reveal: CSS transition on `#tsum` (opacity + transform)
- Trigger: hook into existing `computesuperpower()` in `snp.js` — when it writes to `#tsum`, also trigger the gift state
- Mobile detection: CSS media query `(max-width: 767px)` + JS check for reveal logic

**Key files:**
- `css/styles.css:477-546` — `.report-row`, `.character-panel`, mobile override
- `js/snp.js:648` — `computesuperpower()` writes results to `#tsum`
- `js/character-live2d.js` — PixiJS canvas setup
- `index.html:171-178` — report-row HTML structure

**Technical Risks**

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tap target misaligned on different phone sizes | Medium | Use percentage-based positioning relative to character panel |
| PixiJS canvas overlaps HTML tap target | Low | z-index layering: canvas behind, tap target on top |
| Reveal animation janky on low-end phones | Low | Use compositor-friendly properties only (opacity, transform) |

---

## Implementation Phases

| # | Phase | Description | Status | Parallel | Depends | PRP Plan |
|---|-------|-------------|--------|----------|---------|----------|
| 1 | Mobile character repositioning | Move character to centered layout on mobile, sized to show full body + hands | in-progress | - | - | [plan](../plans/mobile-character-gift-reveal.plan.md) |
| 2 | Gift tap target | Add tappable overlay on turtle area with pulse/glow hint | in-progress | - | 1 | [plan](../plans/mobile-character-gift-reveal.plan.md) |
| 3 | Reveal mechanic | Hide #tsum initially on mobile, reveal on tap with animation | in-progress | - | 2 | [plan](../plans/mobile-character-gift-reveal.plan.md) |
| 4 | Integration | Hook computesuperpower() to reset gift state on new calculations | in-progress | - | 3 | [plan](../plans/mobile-character-gift-reveal.plan.md) |
| 5 | QA | Test on 320/375/414px widths, Android Chrome, iOS Safari | pending | - | 4 | - |

### Phase Details

**Phase 1: Mobile character repositioning**
- **Goal**: 玄鈺 renders centered on mobile, large enough to see body + cupped hands
- **Scope**: CSS changes to `.character-panel` and `.report-row` at `max-width: 767px`
- **Success signal**: Character visible from head to hands on a 375px screen

**Phase 2: Gift tap target**
- **Goal**: Visible, tappable element over the turtle/ornament in her hands
- **Scope**: HTML overlay element + CSS pulse animation
- **Success signal**: Glowing circle on turtle area, registers tap events

**Phase 3: Reveal mechanic**
- **Goal**: Results hidden until tap, then animate in
- **Scope**: JS to toggle visibility, CSS transition for reveal
- **Success signal**: Tap turtle → results smoothly appear

**Phase 4: Integration**
- **Goal**: Gift resets when user makes new changes
- **Scope**: Hook into `computesuperpower()` to re-wrap gift on new results
- **Success signal**: Edit → save → gift reappears → tap → new results

**Phase 5: QA**
- **Goal**: Works on real devices
- **Scope**: Manual testing on multiple widths and browsers
- **Success signal**: No layout breaks, tap works, animation smooth

---

## Decisions Log

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Tap target | HTML overlay on canvas | PixiJS hit detection | Simpler, more reliable, works with existing CSS |
| Mobile only | Yes | Both platforms | Validate concept first, port to desktop if it works |
| Animation | CSS opacity + transform | GSAP, PixiJS animation | No extra dependencies, compositor-friendly |
| Gift visual | Existing turtle in character image | New gift box asset | Zero art cost, already in the image |

---

## Research Summary

**Market Context**
- Gacha games commonly use reveal/unwrap mechanics for results — this borrows that pattern
- Game calculators rarely have character mascots — this is a differentiator

**Technical Context**
- Character already renders via PixiJS with displacement filter + blink animation
- `computesuperpower()` at `snp.js:648` is the single function that writes results
- Mobile CSS already has a `@media (max-width: 767px)` block for the character panel
- Feasibility is HIGH — mostly CSS repositioning + a small JS hook

---

*Generated: 2026-04-16*
*Status: DRAFT - approved by maintainer*
*GitHub Issue: #1*
