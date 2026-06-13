---
tags:
  - factory
  - project
  - e2e-test-recipes
source: factory-archivist
---

# Factory: e2e-test-recipes

## Summary

Demo/test recipe viewer application — vanilla HTML/CSS/JS, no frameworks, no build tools. Used to validate factory automation workflows.

## Status
- **State**: BLOCKED — structural threshold prevents all experiments in run-97d30847
- **Current Score**: project eval 1.0 (10 dimensions), factory composite 0.4635
- **Experiments Run**: 6
- **Kept**: 5, **Reverted**: 1
- **Latest Hypothesis**: H1 (run-97d30847) — Fix XSS + Accessibility Audit — **REVERT** (precheck failed)
- **Open Issue**: GitHub #2 (recipe images on mobile) — **INVALID** (srcset doesn't exist; images are CSS gradients)

## Structural Threshold Issue (run-97d30847)

**The factory eval precheck (score >= 0.8) is structurally unreachable for this project.**

The factory composite score is 0.4635. Hygiene dimensions (tests, lint, type_check, coverage) all score 0.5 because no tooling is detected. The project uses vanilla HTML/CSS/JS with zero dependencies, and `factory.md` guards explicitly forbid adding external dependencies.

Even with perfect capability_surface and observability scores, the maximum achievable factory composite is ~0.68 — well below the 0.8 threshold. This means:
- **H1 (XSS + Accessibility)**: REVERTED despite CLEAN code review and 1.0 eval
- **H2 (Bookmarking)**: SKIPPED — same structural failure
- **H3 (Observability)**: SKIPPED — same structural failure

No experiment can pass the precheck without either relaxing the threshold or changing the dependency guard.

## Current Strategy (2026-06-13, run-97d30847)
**CEO Verdict: PROCEED** — 3 hypotheses approved, but all blocked by structural threshold.

| # | Hypothesis | Category | Priority | Growth Dimension | Status |
|---|---|---|---|---|---|
| H1 | Fix XSS + Accessibility Audit | FIX | high | capability_surface | **REVERT** (precheck 0.4635 < 0.8) |
| H2 | Recipe Bookmarking/Favorites | EXPLORE | medium | capability_surface | **SKIPPED** (same threshold) |
| H3 | Structured Logging/Observability | EXPLORE | medium | observability | **SKIPPED** (same threshold) |

**Targets**: capability_surface 0.0 → improved, observability 0.0 → 0.5+

## Approved Build Plan (2026-06-11)
4-phase sequential build, CEO-approved:
1. **H1 — Scaffold + eval harness** → **DONE** (score: 1.0)
2. **H2 — Recipe viewer MVP** (search, filter, detail modal) → **DONE** (score: 1.0)
3. **H3 — Dark mode toggle** (CSS custom properties, FOUC prevention, localStorage) → **DONE** (score: 1.0)
4. **H4 — Rating system** (5-star, reviews, localStorage, duplicate prevention) → **DONE** (score: 1.0)

## PDF Export Cycle (run-93866f8f, 2026-06-11)
- **H1 — PDF export via print stylesheet** → **DONE** (score: 0.442 → 1.000, PR #5 OPEN, verdict: KEEP)

## What Was Built

### Phase 1 (H1) — Scaffold
| File | Lines | Purpose |
|---|---|---|
| index.html | 23 | Semantic HTML5 structure with CSS/JS links |
| styles.css | 126 | CSS custom properties (8 theme vars), card layout, responsive |
| app.js | 192 | 6 recipes with full data, card rendering |
| eval/score.py | 125 | 4-dimension eval (files, HTML, CSS vars, JS data) |

### Phase 2 (H2) — Recipe Viewer MVP
| Feature | Implementation |
|---|---|
| Search | `#search-input` in header, filters by title and ingredients in real-time |
| Category filter | All/Breakfast/Lunch/Dinner/Dessert buttons with active toggling |
| Detail modal | Click card → modal with ingredients + instructions; close via backdrop/button/Escape |
| Eval expansion | 3 new check functions, composite now 7 dimensions (was 4) |

**H2 diff**: +385 lines / -2 lines across 4 files (app.js, eval/score.py, index.html, styles.css)

### Phase 3 (H3) — Dark Mode Toggle
| Feature | Implementation |
|---|---|
| Dark theme CSS | `:root[data-theme="dark"]` overrides all 8 custom properties + `--modal-backdrop` |
| Toggle button | `#theme-toggle` button with emoji icons, aria-label for a11y |
| FOUC prevention | Inline `<script>` before CSS link reads localStorage, falls back to `prefers-color-scheme` |
| Persistence | localStorage read/write in both inline script (load) and app.js (toggle) |
| Eval expansion | `check_dark_mode()` with 6 sub-checks, composite now 8 dimensions (was 7) |

**H3 diff**: +81 lines across 4 files (app.js +23, eval/score.py +48, index.html +15, styles.css +46, offset by minor removals)

### Phase 4 (H4) — Recipe Rating System
| Feature | Implementation |
|---|---|
| 5-star interactive rating | Unicode stars with hover preview, click-to-rate in modal |
| Average display | Computed avg on cards and in modal with numeric value |
| Duplicate prevention | `rated-recipes` localStorage key; disables stars + shows "Thanks" after rating |
| Text reviews | Textarea appears after rating; stored in `recipe-reviews` localStorage key |
| Recent reviews | Up to 3 most recent reviews displayed in modal |
| Dark mode support | 3 new CSS custom properties (`--star-color`, `--star-empty`, `--rating-bg`) |
| Eval expansion | `check_rating_system()` with 10 sub-checks, composite now 9 dimensions (was 8) |

**H4 diff**: +436 lines / -8 lines across 3 files (app.js +214, styles.css +169, eval/score.py +61/-8)

### Phase 5 (H1/run-93866f8f) — PDF Export
| Feature | Implementation |
|---|---|
| Export button | `🖨️ Export PDF` button in recipe detail modal |
| Print handler | `window.print()` with `document.title` swap for PDF filename, `afterprint` restore |
| CSS print rules | `@media print`: visibility trick, modal at page origin, hide interactive elements |
| High contrast | Override to `#000` on `#fff` regardless of theme; `@page { margin: 20mm 15mm }` |
| Print typography | `font-size: 12pt; line-height: 1.6`; `break-inside: avoid` on lists |
| Eval expansion | `check_pdf_export()` with 11 sub-checks, composite now 10 dimensions (was 9) |

**H5 diff**: +179 / -9 lines across 3 files (app.js +14, styles.css +104, eval/score.py +70/-9)

### Phase 6 (H1/run-97d30847) — XSS Fix + Accessibility Audit (REVERTED)
| Feature | Implementation |
|---|---|
| XSS fix | `buildReviewsHTML()` → `buildReviewsDOM()`, DOM API with `textContent` instead of innerHTML string concat |
| Skip-to-content | `<a class="skip-link">` hidden off-screen, visible on focus |
| Keyboard nav | `tabindex="0"`, `role="button"`, Enter/Space handlers on recipe cards |
| ARIA state | `aria-pressed` on filters, `aria-live="polite"` on grid, `role="radiogroup"` on stars |
| Focus management | Save `activeElement` on modal open, restore on close |
| Focus-visible | `:focus-visible` outlines on all interactive elements |
| Eval expansion | `check_accessibility()` with 10 sub-checks, composite now 11 dimensions (was 10) |

**H6 diff**: +146 / -21 lines across 4 files — **NOT MERGED** (precheck failure)

## Eval Dimensions (all 1.0, as of last merged state — 10 dimensions)
1. file_existence (7%) — index.html, styles.css, app.js
2. html_structure (7%) — doctype, head, body, CSS/JS links
3. css_custom_properties (7%) — :root with 11 custom properties (8 base + 3 rating)
4. js_recipe_data (11%) — recipe array with 6 entries, all required fields
5. search_feature (11%) — input, listener, filter logic
6. category_filter (7%) — filter buttons, category logic
7. detail_view (11%) — modal container, CSS styles, open/close handlers
8. dark_mode (11%) — dark theme CSS, toggle button, FOUC prevention, localStorage
9. rating_system (18%) — star styles, color var, elements, data-value, localStorage, average, click/hover, duplicate prevention, review storage
10. pdf_export (9%) — media print, @page rule, hide non-content, hide interactive, high contrast, break-inside, print typography, export btn, window.print, title swap, afterprint

## Backlog
1. ~~Add dark mode toggle to recipe viewer~~ → Phase 3 **DONE**
2. ~~Implement recipe rating system with 5-star reviews~~ → Phase 4 **DONE**
3. ~~Add recipe export to PDF~~ → Phase 5 (run-93866f8f) **DONE**
4. Add accessibility audit (ARIA, keyboard nav, contrast ratios) — **BLOCKED** by threshold
5. Add recipe bookmarking/favorites with localStorage — **BLOCKED** by threshold

## Research Findings (2026-06-11)
- Tech stack: Vanilla HTML + CSS + JS (no frameworks)
- Dark mode: CSS custom properties + data-theme attribute + localStorage
- Ratings: Unicode stars + localStorage persistence
- Eval: File existence + pattern matching (static analysis)
- CEO verdict: **PROCEED** — research thorough, recommendations sound

### PDF Export Research (2026-06-11, run-93866f8f)
- **Target:** Add recipe export to PDF feature
- **Approach:** `window.print()` + CSS `@media print` — the ONLY zero-dependency solution (jsPDF/html2pdf ruled out by factory.md guard)
- **Key technique:** CSS visibility trick — hide all `body *`, make modal content visible at absolute position (0,0)
- **Print CSS:** `@page` margins, `break-inside: avoid` on lists, black-on-white color override, hide interactive elements
- **Browser compat:** Core features universal; `@page { size }` Chromium-only but degrades gracefully
- **Limitations:** User must interact with print dialog; limited mobile support (acceptable for demo app)
- **Files to modify:** styles.css (print rules ~30-40 lines), app.js (export button + handler), eval/score.py (new check)
- **CEO verdict:** **PROCEED** — research thorough, no-dependency constraint correctly handled

### Improvement Research (2026-06-13, run-97d30847)
- **Composite score**: 0.4385 (project eval 1.0, growth metrics 0.0)
- **GitHub #2 analysis**: Issue describes malformed `srcset` — doesn't exist in code. Images are CSS gradients. Recommend close as invalid.
- **XSS vulnerability**: `buildReviewsHTML()` at app.js:316-318 inserts user text into innerHTML without escaping. Fix: use `textContent`.
- **Accessibility gaps**: Cards lack tabindex/role/keyboard handlers; modal needs `<dialog>` migration; filters need `aria-pressed`; rating needs radiogroup roles; no skip-to-content; contrast unverified.
- **Bookmarking**: localStorage `recipe-favorites` key following proven multi-key pattern. Heart icon toggle, filter option.
- **Observability**: Score 0.0. Recommended: lightweight console.log wrapper with structured JSON, instrument key interactions, `window.onerror` handler.
- **CEO verdict**: **PROCEED** — research thorough, XSS is valid, issue #2 analysis convincing. Strategist should follow FEEC ordering.

## Cycle Summary

**Initial build cycle completed 2026-06-11** — 4/4 phases kept, 0 reverts. Final eval 1.0 across 9 dimensions. E2E verified via python3 HTTP server smoke test. Baseline factory eval score: 0.4369. Full cycle details in `experiments/e2e-test-recipes-cycle-summary.md`.

**PDF export cycle (run-93866f8f) 2026-06-11** — Experiment #5 KEEP. Score: 0.442 → 1.000 (+0.558). Eval 1.0 across 10 dimensions. CEO code review: CLEAN (no issues). PR #5 open, pending merge. Commit: f39e85b.

**XSS + Accessibility cycle (run-97d30847) 2026-06-13** — Experiment #6 **REVERT**. Code quality verified CLEAN (CEO review + Reviewer PASS). Project eval 1.0 across 11 dimensions. However, factory eval precheck failed: composite score 0.4635 < 0.8 threshold. The threshold is structurally unreachable — hygiene dimensions score 0.5 (no tooling) and dependency guards forbid adding any. Max achievable composite: ~0.68. H2 and H3 skipped for the same reason.

## Recent Experiments
- Experiment #1 — Project scaffold and eval harness (H1) (**KEEP**, +1.0)
- Experiment #2 — Recipe Viewer MVP: search, filter, detail modal (H2) (**KEEP**, 1.0 maintained)
- Experiment #3 — Dark Mode Toggle: CSS custom properties, FOUC prevention, localStorage (H3) (**KEEP**, 1.0 maintained)
- Experiment #4 — Recipe Rating System: 5-star interactive ratings, text reviews, duplicate prevention (H4) (**KEEP**, 1.0 maintained)
- Experiment #5 — PDF Export: window.print() + CSS print stylesheet, 11-check eval (H1/run-93866f8f) (**KEEP**, 0.442 → 1.000, +0.558)
- Experiment #6 — Fix XSS + Accessibility Audit: DOM API migration, skip link, keyboard nav, ARIA, focus management (H1/run-97d30847) (**REVERT**, precheck 0.4635 < 0.8)

## Archive Inventory
- **Experiment notes**: 6 per-experiment + 3 cycle summaries (`experiments/`)
- **Strategy snapshots**: 7 dated snapshots (`strategies/`)
- **Source notes**: 16 research findings (`sources/`)
- **Patterns**: 12 cross-project patterns (`patterns/patterns.md`)

## Blocking Issue (Action Required)

The factory eval precheck threshold (0.8) is structurally unreachable for this project. No Improve cycles should be dispatched until one of these resolutions is applied:
1. Lower precheck threshold for zero-dependency projects
2. Adjust hygiene dimension scoring for intentional no-tooling stacks
3. Selectively override the dependency guard in factory.md
