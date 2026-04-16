# 神通推演計算器 — Project Rules

## Git Workflow

**NEVER push directly to `main`.** All work happens on `dev` or feature branches.

### Branches
- `main` — **Production**. GitHub Pages deploys from here. Only updated via PR merge.
- `dev` — **Development**. All work happens here. Push freely.
- `feature/*` — Optional feature branches off `dev` for larger changes.

### Flow
```
1. Work on `dev` branch
2. Commit and push to `dev` freely
3. When ready to release: create PR from dev → main
4. Review on GitHub, merge PR
5. GitHub Pages auto-deploys from main
```

### Commands
```bash
# Start working
git checkout dev

# Push work in progress
git add . && git commit -m "..." && git push

# Ready to release — create PR
gh pr create --base main --head dev --title "v2.0.X: description"

# After PR merged, sync dev
git checkout dev && git pull origin main
```

## Versioning

- Version tracked in `VERSION` file (semver: MAJOR.MINOR.PATCH)
- CSS cache bust uses `?v=XX` in index.html `<link>` tag
- Bump VERSION + CSS version when merging to main
- Current: see `VERSION` file

### When to bump
- PATCH (2.0.X): bug fixes, CSS tweaks, small UI changes
- MINOR (2.X.0): new features, new sections
- MAJOR (X.0.0): major redesign, breaking data changes

## Tech Stack
- Vanilla JS + jQuery + Bootstrap 5.3.8
- PixiJS 7.3.3 (character animation)
- GitHub Pages (static hosting from `main`)
- No build step — edit files directly

## File Structure
- `index.html` — Main page
- `css/styles.css` — All custom styles (design tokens + components)
- `js/snp.js` — Calculator logic + UI
- `js/snp.core.js` — Pure computation (testable)
- `js/character-live2d.js` — Character animation
- `js/vendor/` — jQuery, lz-string

## CSS Convention
- Design tokens in `:root` variables
- Cache bust version in HTML link tag: `styles.css?v=XX`
- Bump `?v=` number on every CSS change that goes to production
