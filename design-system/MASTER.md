# Design System: Sword Life Power Calculator (神通推演計算器)

**Product Type:** Gaming Tool / Calculator
**Style:** Dark Glassmorphism (inspired by Gigantic Media)
**Stack:** HTML + Bootstrap 5.3.8 + jQuery
**Date:** 2026-04-14

---

## 1. Color Tokens

### Semantic Tokens (CSS Custom Properties)

```css
:root {
  /* Surfaces */
  --surface-primary: #1a1a1e;        /* Main background */
  --surface-secondary: #2a2a2e;      /* Card/panel backgrounds */
  --surface-tertiary: #3a3a3e;       /* Elevated surfaces */
  --surface-glass: rgba(255, 255, 255, 0.06);  /* Glassmorphism */
  --surface-glass-hover: rgba(255, 255, 255, 0.10);
  --surface-glass-border: rgba(240, 231, 233, 0.12);

  /* Text */
  --text-primary: #f0e7e9;           /* Primary text (cream) */
  --text-secondary: #ae9ea1;         /* Muted text (warm gray-pink) */
  --text-tertiary: #6f6769;          /* Disabled/hint text */
  --text-on-accent: #f0e7e9;         /* Text on accent backgrounds */

  /* Accent */
  --accent-primary: #e85b54;         /* Coral red - CTAs, highlights */
  --accent-primary-hover: #d44d47;   /* Darker coral on hover */
  --accent-glow: rgba(232, 91, 84, 0.4); /* Glow effect */

  /* Lines & Borders */
  --line-primary: #5a5052;           /* Visible borders */
  --line-secondary: rgba(240, 231, 233, 0.08); /* Subtle dividers */
  --line-accent: rgba(232, 91, 84, 0.3); /* Accent-tinted borders */

  /* State Colors */
  --state-success: #4ade80;
  --state-warning: #fbbf24;
  --state-error: #ef4444;
  --state-info: #60a5fa;

  /* Game-specific */
  --game-fire: #e85b54;              /* 火 type */
  --game-sword: #fbbf24;             /* 劍 type */
  --game-thunder: #60a5fa;           /* 雷 type */
  --game-tribe: #1a1a1e;             /* 百族 type */
}
```

### Dark Mode Only

This is a dark-mode-only design. No light mode variant needed.

---

## 2. Typography

### Font Stack

```css
--font-primary: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

- **Inter**: Clean geometric sans-serif (free Suisse Intl alternative)
- **Noto Sans TC**: Traditional Chinese support
- **Monospace**: For numeric data in tables

### Type Scale

| Role | Size | Weight | Letter-spacing | Line-height |
|------|------|--------|----------------|-------------|
| Page Title | 2rem (32px) | 500 | -0.03em | 1.1 |
| Section Title | 1.25rem (20px) | 500 | -0.02em | 1.2 |
| Table Header | 0.75rem (12px) | 600 | 0.05em | 1.4 |
| Body/Cell | 0.8125rem (13px) | 400 | normal | 1.5 |
| Caption/Label | 0.75rem (12px) | 400 | normal | 1.4 |
| Badge | 0.6875rem (11px) | 500 | 0.02em | 1.2 |
| Numeric Data | 0.8125rem (13px) | 500 | normal | 1.5 |

### Number Display

Use `font-variant-numeric: tabular-nums` for all data columns to prevent layout shift.

---

## 3. Spacing System (8px base)

| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 0.25rem (4px) | Inline gaps |
| --space-2 | 0.5rem (8px) | Cell padding, tight gaps |
| --space-3 | 0.75rem (12px) | Default cell padding |
| --space-4 | 1rem (16px) | Card padding, section gaps |
| --space-5 | 1.5rem (24px) | Section padding |
| --space-6 | 2rem (32px) | Major section spacing |
| --space-8 | 3rem (48px) | Page-level spacing |

---

## 4. Effects

### Glassmorphism

```css
.glass-card {
  background: var(--surface-glass);
  border: 1px solid var(--surface-glass-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

### Glow Dots (Decorative)

```css
.glow-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--accent-primary);
  border-radius: 50%;
  filter: blur(2px);
}

.glow-dot-lg {
  width: 0.75rem;
  height: 0.75rem;
  filter: blur(3px);
}
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px var(--accent-glow);
```

### Transitions

```css
--transition-fast: 150ms ease-out;
--transition-normal: 250ms ease-out;
--transition-slow: 400ms ease-out;
```

---

## 5. Component Patterns

### Tables

- Glass card container with backdrop blur
- Header row: `var(--surface-tertiary)` background, uppercase labels, small tracking
- Body cells: Semi-transparent background, tabular numbers
- Row hover: `var(--surface-glass-hover)` transition
- Borders: `var(--line-secondary)` between rows

### Buttons

- Primary: `var(--accent-primary)` bg, cream text, no border-radius (sharp like Gigantic Media)
- Secondary: Transparent bg, `var(--line-primary)` border, cream text
- Hover: Darken bg or add subtle glow

### Offcanvas / Side Panels

- Dark overlay: `rgba(0, 0, 0, 0.6)` + `backdrop-filter: blur(4px)`
- Panel: `var(--surface-secondary)` with glass border
- Background: Game art as faded bg image (existing imgl.jpg/imgr.jpg) with overlay

### Select Dropdowns

- Dark bg matching surface-secondary
- Light text
- Accent border on focus

### Badges

- Small, uppercase, tight tracking
- Accent red bg for important badges
- Muted surface for informational badges

---

## 6. Decorative Elements

### Horizontal Lines with Dots

Thin 1px lines in `var(--line-primary)` with small glowing accent dots at endpoints or intersections.

### Section Dividers

Full-width line with a centered glow dot to separate content blocks.

### Corner Accents

Small "L"-shaped corner marks at card corners for a tech/gaming aesthetic.

---

## 7. Responsive Breakpoints

| Breakpoint | Max-width | Behavior |
|------------|-----------|----------|
| Desktop | > 992px | Two-column table layout |
| Tablet | <= 991px | Stack tables vertically |
| Mobile | <= 576px | Full-width, compact spacing |

---

## 8. Anti-Patterns to Avoid

- Raw hex colors in components (use tokens)
- Default Bootstrap blue (#0d6efd) anywhere
- White backgrounds on any surface
- Default Bootstrap border-radius on buttons (use sharp edges)
- Emoji as icons
- Placeholder-only labels
- Gray-on-gray text below 3:1 contrast
- Layout shifts from dynamic content (use tabular-nums)

---

## 9. Accessibility

- Text contrast: >= 4.5:1 for body text (#f0e7e9 on #1a1a1e = ~13:1)
- Secondary text: >= 3:1 (#ae9ea1 on #1a1a1e = ~5.5:1)
- Touch targets: >= 44px for mobile
- Focus rings: 2px solid var(--accent-primary) with offset
- Keyboard navigation: Tab order follows visual order
- Game data: Use tabular-nums for numeric alignment
