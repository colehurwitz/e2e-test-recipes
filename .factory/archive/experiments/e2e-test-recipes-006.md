---
tags:
  - factory
  - experiment
  - e2e-test-recipes
project: e2e-test-recipes
experiment_id: 6
verdict: REVERT
score_delta: "N/A — precheck failed before merge (factory composite 0.4635 < 0.8 threshold)"
date: 2026-06-13
source: factory-archivist
---

# Experiment #6: Fix XSS vulnerability and add accessibility audit

## Hypothesis
H1 (run-97d30847): Fix XSS in `buildReviewsHTML()` via DOM API migration + comprehensive accessibility audit (skip link, keyboard nav, ARIA attributes, focus management, focus-visible outlines).

## Result
**REVERT** — Code quality was verified CLEAN by CEO review and PASS by Reviewer, project eval maintained 1.0 across 11 dimensions. However, the factory eval precheck failed: composite factory score 0.4635 < required 0.8 threshold. PR #7 was not merged.

### Why the Precheck Failed (Structural Threshold Issue)
The factory composite score is dominated by hygiene dimensions (tests, lint, type_check, coverage), which all score 0.5 because no tooling is detected. The project uses vanilla HTML/CSS/JS with no build tools, and `factory.md` guards explicitly forbid adding external dependencies (no npm, no frameworks, no build steps).

**Score breakdown:**
- Project eval: 1.0 (all 11 dimensions pass)
- Factory hygiene (tests, lint, type_check, coverage): 0.5 each (no tooling detected)
- capability_surface: improved (XSS fix + accessibility)
- Maximum achievable factory composite: ~0.68 (even with perfect capability_surface + observability)

The 0.8 precheck threshold is structurally unreachable for this project without violating the dependency guard.

## What Changed (code was correct but reverted)

### Security Fix (XSS)
- Renamed `buildReviewsHTML()` → `buildReviewsDOM()`, now returns a DOM element instead of HTML string
- Replaced `innerHTML` string concatenation with `document.createElement()` + `textContent` for user review text
- All callers updated: `innerHTML = buildReviewsHTML()` → `innerHTML = ""; appendChild(buildReviewsDOM())`
- Null return for empty reviews (callers check before appending)

### Accessibility Improvements
| Feature | Implementation |
|---|---|
| Skip-to-content link | `<a href="#main-content" class="skip-link">` with CSS hide/show on focus |
| aria-live region | `aria-live="polite"` on recipe grid for dynamic content updates |
| Keyboard-navigable cards | `tabindex="0"`, `role="button"`, `aria-label`, Enter/Space keydown handlers |
| Filter button state | `aria-pressed` toggled on category filter buttons |
| Modal focus management | Focus `#modal-close` on open, restore `modalTrigger` on close |
| Star rating ARIA | `role="radiogroup"` on container, `role="radio"` + `aria-checked` + `aria-label` on stars, `tabindex="0"` |
| Focus-visible outlines | `:focus-visible` with `outline: 2px solid var(--accent)` on cards, filters, toggle, close, export, search, stars |

### Eval Expansion
- New `check_accessibility()` function with 10 sub-checks
- Composite weights rebalanced from 10 to 11 dimensions
- All 10 accessibility sub-checks pass → 1.0 score

### Diff Stats
- **4 files changed**: index.html (+4/-2), app.js (+55/-10), styles.css (+38/-0), eval/score.py (+49/-9)
- **+146 / -21 lines** total

## CEO Review Checklist (all PASS)
- Correctness: PASS
- Security: PASS — user text now safe via textContent
- Edge cases: PASS — null returns handled, modalTrigger cleanup
- Missing tests: PASS — 10-check eval covers all acceptance criteria
- Style: PASS — follows existing patterns
- Scope: PASS — only declared files modified

## Impact on Remaining Hypotheses
- **H2 (bookmarking)** and **H3 (observability)** were SKIPPED — they face the same structural precheck failure. No experiment can pass the 0.8 threshold without hygiene tooling.

## Links
- Project: e2e-test-recipes
- Issue: #6
- PR: #7 (NOT MERGED — reverted)
- Commit: 9428d5c
- Branch: factory/run-97d30847
- Strategy: H1 of run-97d30847
