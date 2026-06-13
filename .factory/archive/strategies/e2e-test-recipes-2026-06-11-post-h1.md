---
tags:
  - factory
  - strategy
  - e2e-test-recipes
date: 2026-06-11
source: factory-archivist
---

# Strategy: e2e-test-recipes — 2026-06-11 (Post-H1)

## Current State
Phase 1 (H1) complete. Project scaffold and eval harness are in place with a composite score of 1.0. All 4 eval dimensions pass: file existence, HTML structure, CSS custom properties, and JS recipe data.

## Next Up: H2 — Recipe Viewer MVP
The immediate next step is H2: build the complete recipe viewer with card layout (CSS Grid, responsive), detail view (modal/overlay), search (text filtering by title/ingredients), and category filter. Eval will be extended to cover DOM structure patterns, search input, filter mechanism, and detail view.

## Remaining Phases
- **H3 — Dark mode toggle**: CSS custom properties already in place (8 vars on :root), making this a smooth addition. data-theme attribute, localStorage persistence, FOUC-prevention inline script.
- **H4 — Rating system**: Unicode stars, localStorage, interactive hover/click, average calculation.

## Key Observations
- CSS custom properties were set up in H1 specifically to prepare for H3 (dark mode). This front-loading should pay off.
- 6 recipes are hardcoded with full data (ingredients, instructions, prepTime, servings) — sufficient for MVP demo.
- Eval harness uses static analysis (file reads + regex), not headless browser. Works well for structure checks; may need augmentation for interactive features in H3/H4.
