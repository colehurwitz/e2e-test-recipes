---
tags:
  - factory
  - experiment
  - e2e-test-recipes
project: e2e-test-recipes
experiment_id: 1
verdict: KEEP
score_delta: "+1.0"
date: 2026-06-11
source: factory-archivist
---

# Experiment #1: Project scaffold and eval harness (H1)

## Hypothesis
Create the project skeleton — index.html with semantic HTML structure, styles.css with CSS custom properties (light theme defaults, prepared for dark mode), app.js with module structure and 6 hardcoded recipes, and eval/score.py that validates file existence, HTML structure, CSS custom properties, and JS recipe data.

## Result
**KEEP** — score changed from N/A (no eval) to 1.0 (all 4 eval dimensions pass)

## What Changed
- **index.html** (23 lines): Semantic HTML5 with doctype, head, body, CSS/JS links
- **styles.css** (126 lines): CSS custom properties on :root (8 theme variables: --bg-primary, --bg-secondary, --bg-card, --text-primary, --text-secondary, --accent, --border, --shadow), card layout styles, responsive foundations
- **app.js** (192 lines): 6 hardcoded recipes (Classic Pancakes, Caesar Salad, Grilled Salmon, Margherita Pizza, Chocolate Brownies, Chicken Stir-Fry) with full data (id, title, category, image gradient, ingredients, instructions, prepTime, servings), plus card rendering logic
- **eval/score.py** (125 lines): 4-dimension eval — file_existence, html_structure, css_custom_properties, js_recipe_data — outputs JSON score object

## Eval Dimensions (all 1.0)
| Dimension | Score | Details |
|---|---|---|
| file_existence | 1.0 | index.html ✓, styles.css ✓, app.js ✓ |
| html_structure | 1.0 | doctype ✓, head ✓, body ✓, links_css ✓, links_js ✓ |
| css_custom_properties | 1.0 | :root ✓, 8/8 properties found |
| js_recipe_data | 1.0 | array ✓, 6 recipes, required fields ✓ |

## Links
- Project: e2e-test-recipes
- Commit: 3bf5c9c ("Add project scaffold and eval harness (H1)")
- Branch: factory/run-322cd887
