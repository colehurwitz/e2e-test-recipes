---
tags:
  - factory
  - experiment
  - e2e-test-recipes
project: e2e-test-recipes
experiment_id: 2
verdict: KEEP
score_delta: +0.0 (maintained 1.0 across expanded eval)
date: 2026-06-11
source: factory-archivist
---

# Experiment #2: Recipe Viewer MVP (H2)

## Hypothesis
Adding search, category filtering, and a detail modal will bring the app from a static card display to an interactive viewer, raising capability_surface from ~0.1 to ~0.5.

## Result
**KEEP** — composite score 1.0 across all 7 eval dimensions (expanded from 4 in H1). The eval was updated alongside the features so all new dimensions (search_feature, category_filter, detail_view) pass at 1.0.

## What Changed

### Features Added
- **Search input** (`#search-input` in header): filters recipes by title and ingredients in real-time
- **Category filter buttons**: All / Breakfast / Lunch / Dinner / Dessert with active-state toggling, combined with search
- **Recipe detail modal**: click card → full modal with ingredients list and step-by-step instructions; closes via backdrop click, close button, or Escape key

### Files Modified (385 insertions, 2 deletions)
| File | Change |
|---|---|
| `index.html` | +19 lines — search input, category filter container, modal overlay markup |
| `styles.css` | +199 lines — filter button styles, modal/overlay styles, transitions, responsive |
| `app.js` | +96 lines — search handler, filter logic, modal open/close, render pipeline |
| `eval/score.py` | +73 lines — 3 new check functions (search, filter, detail view), 7-dim composite |

### Eval Dimensions (all 1.0)
1. file_existence (10%) — all 3 files present
2. html_structure (15%) — doctype, head, body, CSS/JS links
3. css_custom_properties (15%) — :root with 8/8 vars
4. js_recipe_data (20%) — array with 6 recipes, all required fields
5. search_feature (15%) — input element, event listener, filter logic
6. category_filter (10%) — filter buttons in HTML, category logic in JS
7. detail_view (15%) — modal container, modal CSS, open/close handlers

## Links
- Project: e2e-test-recipes
- Commit: e47e7c6
- Phase: H2 of 4-phase build plan
