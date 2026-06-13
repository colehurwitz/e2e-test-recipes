---
tags:
  - factory
  - strategy
  - e2e-test-recipes
date: 2026-06-13
source: factory-archivist
---

# Strategy: e2e-test-recipes — 2026-06-13

## CEO Verdict: PROCEED

All 3 hypotheses approved. No issues found. Execute in priority order — each gets full review pipeline.

## Context

- **Composite score**: 0.4635 (project eval 1.0 across 10 dimensions; growth metrics drag composite)
- **Weakest dimensions**: capability_surface (0.0), observability (0.0)
- **Experiments to date**: 5 kept, 0 reverted
- **Open issue**: GitHub #2 — confirmed invalid (CSS gradients, not `<img>`)
- **XSS vulnerability**: `buildReviewsHTML()` at app.js:316 — innerHTML string concatenation with user text

## Design Space Assessment

| Dimension | Score | Notes |
|---|---|---|
| Features | 4 | Search, filter, dark mode, ratings, PDF export shipped |
| Bug fixes | 0 | XSS in buildReviewsHTML() |
| Instrumentation | 0 | Zero logging, observability 0.0% |
| Eval improvements | 2 | 10-dimension eval harness |

**Underserved:** Bug fixes, Instrumentation, Eval improvements

## Approved Hypotheses (Priority Order)

### H1: Fix XSS + Accessibility Audit (FIX, high)
- **Category**: FIX — bundles XSS security fix with accessibility improvements per CEO direction
- **Growth dimension**: capability_surface
- **XSS fix**: Replace innerHTML string concatenation in `buildReviewsHTML()` with DOM API (`createElement` + `textContent`)
- **Accessibility scope**: Skip-to-content link, `aria-live` region, keyboard-navigable cards (`tabindex="0"`, `role="button"`, Enter/Space handlers), `aria-pressed` on filters, focus management (focus into modal on open, restore on close), `role="radiogroup"` on star ratings, `:focus-visible` outlines
- **Eval**: New `check_accessibility()` with ~7 sub-checks + XSS safety check
- **Files**: index.html, app.js, styles.css, eval/score.py

### H2: Recipe Bookmarking/Favorites (EXPLORE, medium)
- **Category**: EXPLORE — clears backlog item
- **Growth dimension**: capability_surface
- **Implementation**: localStorage `recipe-favorites` key, heart button on cards, Favorites filter, modal heart state
- **Pattern**: Follows proven localStorage multi-key pattern (ratings, reviews, theme)
- **Eval**: New `check_favorites()` with ~6 sub-checks
- **Files**: app.js, styles.css, eval/score.py

### H3: Structured Logging/Observability (EXPLORE, medium)
- **Category**: EXPLORE — new capability
- **Growth dimension**: observability
- **Implementation**: Zero-dependency `logger` object with `info`/`warn`/`error` methods, structured JSON via `console` methods, instrument 8+ user interactions, `window.onerror` handler
- **Eval**: New `check_observability()` with ~5 sub-checks
- **Files**: app.js, eval/score.py

## Growth Dimension Coverage
- capability_surface: H1, H2
- observability: H3
- Minimum 2 required, 3 present ✓

## Backlog Convergence
- 2 existing items cleared (H1: accessibility, H2: bookmarking)
- 1 new item proposed: Resolve GitHub issue #2 (close as invalid or redefine)

## Anti-patterns Flagged
- innerHTML with user input (XSS — being fixed in H1)
- External dependencies (forbidden by factory.md)
- Overscoping to full WCAG AAA (scope to A/AA)
- Logging sensitive/user-generated content (log events and metadata only)
- Overwriting existing eval checks (new checks must be additive)
