---
tags:
  - factory
  - experiment
  - e2e-test-recipes
project: e2e-test-recipes
experiment_id: 3
verdict: KEEP
score_delta: +0.0
date: 2026-06-11
source: factory-archivist
---

# Experiment #3: Dark Mode Toggle (H3)

## Hypothesis
Adding a dark mode toggle with CSS custom properties, FOUC prevention, and localStorage persistence will increase capability_surface while maintaining existing eval score.

## Result
**KEEP** — composite score 1.0 maintained (was 1.0). Eval expanded from 7 to 8 dimensions; new `dark_mode` dimension scores 1.0/1.0.

## What Changed
- **styles.css**: Added `:root[data-theme="dark"]` block with all 8 CSS custom properties overridden for dark theme. Added `--modal-backdrop` variable. Added `.theme-toggle` button styles with hover state. Updated modal backdrop to use CSS variable. Added responsive layout for header controls.
- **index.html**: Added inline `<script>` before CSS link for FOUC prevention (reads localStorage, falls back to `prefers-color-scheme` media query, sets `data-theme` before paint). Added `<button id="theme-toggle">` in new `.header-controls` wrapper alongside search.
- **app.js**: Added `getTheme()`, `updateToggleButton()`, and `toggleTheme()` functions. Toggle button wired up on DOMContentLoaded. Persists preference to localStorage.
- **eval/score.py**: Added `check_dark_mode()` evaluating 6 sub-checks (CSS dark theme, 8/8 dark properties, toggle button, FOUC prevention, JS toggle logic, localStorage persistence). Eval weights rebalanced to 8 dimensions (dark_mode at 15%).

## Key Implementation Details
- FOUC prevention via inline script placed before stylesheet link — reads localStorage first, falls back to `prefers-color-scheme` media query
- Toggle button uses emoji icons (☀️/🌙) with aria-label for accessibility
- Dark theme overrides all 8 existing CSS custom properties plus adds `--modal-backdrop`
- No flash on page load even with dark preference saved

## Links
- Project: e2e-test-recipes
- Commit: 59b615b
- Phase: H3 (3 of 4)
