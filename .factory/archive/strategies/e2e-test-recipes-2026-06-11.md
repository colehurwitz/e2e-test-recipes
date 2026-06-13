---
tags:
  - factory
  - strategy
  - e2e-test-recipes
date: 2026-06-11
source: factory-archivist
---

# Strategy: e2e-test-recipes — 2026-06-11

## CEO Verdict
**APPROVED** — Plan is well-structured with 4 right-sized phases in correct dependency order.

## Build Plan (4 Phases, Sequential)

### Phase 1 (H1): Project scaffold and eval harness
- **Category:** EXPLORE | **Growth:** factory_effectiveness
- Create `index.html` (semantic HTML), `styles.css` (CSS custom properties), `app.js` (module structure, 5-8 hardcoded recipes)
- Create `eval/score.py` — checks file existence, valid HTML structure, CSS custom properties, JS recipe array
- **Expected impact:** factory_effectiveness 0.0 → 0.3, capability_surface 0.0 → 0.1

### Phase 2 (H2): Recipe viewer MVP
- **Category:** EXPLORE | **Growth:** capability_surface
- CSS Grid card layout (responsive: 3/2/1 columns), detail view overlay/modal, real-time search, category filter
- 6-8 hardcoded recipes with full data (id, title, category, ingredients, instructions, prepTime, servings)
- Extend eval to verify DOM structure, search input, filter mechanism, detail view
- **Expected impact:** capability_surface 0.1 → 0.5, factory_effectiveness 0.3 → 0.5

### Phase 3 (H3): Dark mode toggle
- **Category:** EXPLORE | **Growth:** capability_surface | **Backlog item #1**
- CSS custom properties on `:root[data-theme]`, toggle button with sun/moon icon, localStorage persistence
- FOUC prevention via inline `<script>` in `<head>`, `prefers-color-scheme` fallback
- Extend eval to verify theme variables, toggle button, localStorage usage
- **Expected impact:** capability_surface 0.5 → 0.7

### Phase 4 (H4): Recipe rating system
- **Category:** EXPLORE | **Growth:** capability_surface | **Backlog item #2**
- Unicode stars (★/☆) with hover preview and click-to-rate, localStorage persistence
- Average display on cards, interactive rating in detail view, duplicate prevention
- Stretch: optional text reviews stored in localStorage
- Extend eval to verify star elements, localStorage ratings, average calculation
- **Expected impact:** capability_surface 0.7 → 0.9

## Anti-patterns to Avoid
- No React/TypeScript/build tools — vanilla only
- No external APIs or image hosting — hardcoded data, CSS gradient placeholders
- Single-page architecture — no routing
- All colors via CSS custom properties from the start

## New Backlog Items (Future)
- Accessibility audit (ARIA labels, keyboard nav, contrast ratios)
- Print stylesheet for recipe detail view
- Recipe bookmarking/favorites with localStorage

## Execution Instructions
Builder implements phases sequentially: H1 → H2 → H3 → H4. Each phase = one commit + one PR review cycle.
