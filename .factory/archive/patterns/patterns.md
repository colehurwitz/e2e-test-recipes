---
tags:
  - factory
  - patterns
source: factory-archivist
---

# Cross-Project Patterns

## Greenfield Projects Need Base App Before Backlog
Discovered in e2e-test-recipes research (2026-06-11).
When a project backlog assumes existing features (e.g., "add dark mode to recipe viewer"), the factory must first build the base application before addressing any backlog items. Strategy should explicitly phase: scaffold + eval harness first, then MVP, then backlog features.

## Vanilla Stack for Demo/Test Apps
Discovered in e2e-test-recipes research (2026-06-11).
For demo/test applications, vanilla HTML/CSS/JS with zero dependencies is preferred over frameworks. Zero setup friction, instant testability, no build step to break. Hardcoded data over external APIs to avoid network flakiness in tests.

## Front-Load CSS Custom Properties for Future Theming
Discovered in e2e-test-recipes experiment #1 (2026-06-11).
When a build plan includes a dark mode phase, define CSS custom properties in the scaffold phase — not at dark mode time. In H1, 8 theme variables were set on :root from the start, so H3 (dark mode) only needs to add the alternate theme values rather than retrofitting all hardcoded colors. Front-loading pays off in reduced churn later.

## Static Analysis Eval Works Well for Scaffold Validation
Discovered in e2e-test-recipes experiment #1 (2026-06-11).
For greenfield scaffold phases, a static analysis eval (file existence, regex pattern matching) is sufficient and scored 1.0 on first run. No headless browser needed at this stage. Eval complexity should match what's being measured — save headless testing for interactive feature phases (H3/H4).

## FOUC Prevention Needs Inline Script Before Stylesheet
Discovered in e2e-test-recipes experiment #3 (2026-06-11).
When implementing dark mode with localStorage persistence, place a blocking inline `<script>` before the `<link rel="stylesheet">` to read the saved theme and set `data-theme` on `<html>` before the first paint. Without this, users see a flash of the default (light) theme before JavaScript loads. The inline script should also fall back to `prefers-color-scheme` media query for first-time visitors.

## Incremental Eval Expansion Maintains Confidence
Discovered across e2e-test-recipes experiments #1–#4 (2026-06-11).
Each build phase should expand the eval with new dimension-specific checks rather than modifying existing ones. H1 started with 4 dimensions, H2 added 3 (search, filter, detail), H3 added 1 (dark_mode with 6 sub-checks), H4 added 1 (rating_system with 10 sub-checks). Rebalancing weights each phase keeps composite scores comparable while ensuring new features are covered. Four consecutive phases maintained 1.0 composite — incremental expansion works.

## localStorage as Multi-Key State Store for Vanilla Apps
Discovered in e2e-test-recipes experiment #4 (2026-06-11).
When building interactive features without a backend, partition localStorage into separate keys per concern (e.g., `recipe-ratings`, `rated-recipes`, `recipe-reviews`) rather than one monolithic state object. This avoids data corruption if one key's format changes, makes debugging easier (inspect individual keys), and lets features like duplicate prevention use a simple array check rather than parsing a nested structure.

## 4-Phase Greenfield Build Completes Reliably
Discovered in e2e-test-recipes full build cycle (2026-06-11).
A 4-phase greenfield build (scaffold → MVP → UX polish → interactive feature) completed with 4/4 keeps and 0 reverts, maintaining 1.0 eval score throughout. Key factors: each phase was self-contained with its own eval expansion, phases built on prior work without modifying it, and static analysis eval was sufficient for all phases. This pattern is a reliable template for similar demo/test app builds.

## Eval-First Development Causes Large Score Jumps
Discovered in e2e-test-recipes experiment #5 / run-93866f8f (2026-06-11).
When the eval harness is expanded with a new dimension BEFORE the feature is implemented (adding `check_pdf_export()` to the eval spec as part of the build), the baseline score drops (0.442 in this case) because the new checks fail. Once the feature is built, the score jumps dramatically (+0.558). This is expected and desirable — it proves the eval is testing real behavior. The pattern: commit eval expansion first, verify low score, then implement feature and verify score recovery. Large deltas in this context indicate thorough eval coverage, not fragile scoring.

## CSS Visibility Trick for Print-Specific Content Isolation
Discovered in e2e-test-recipes experiment #5 (2026-06-11).
When implementing PDF export via `window.print()` for a modal-based app, the CSS `visibility: hidden` / `visible` pattern (`body * { visibility: hidden }` then `.modal * { visibility: visible }`) is more reliable than `display: none` for isolating print content. Combined with absolute positioning at `(0,0)`, it produces clean single-page output. Title swap via `document.title` + `afterprint` event gives meaningful PDF filenames without side effects. This zero-dependency approach works for any vanilla app with a modal detail view.

## DOM API Over innerHTML for User-Generated Content
Discovered in e2e-test-recipes experiment #6 (2026-06-13).
When rendering user-generated text in vanilla JS, always use `document.createElement()` + `textContent` instead of innerHTML string concatenation. The XSS vulnerability in `buildReviewsHTML()` was a textbook stored XSS — user review text was concatenated directly into innerHTML. The fix (rename to `buildReviewsDOM()`, return DOM nodes, use `textContent`) is zero-risk and zero-dependency. This should be a standard check in all vanilla JS builds: grep for innerHTML assignments that include user data.

## Bundle Security Fix with Related Feature Work
Discovered in e2e-test-recipes experiment #6 (2026-06-13).
When a security vulnerability exists in a feature area that also needs improvement (e.g., XSS in review rendering + missing accessibility), bundle the fix with the feature work in one experiment rather than splitting into separate PRs. The XSS fix and accessibility audit were naturally co-located — the DOM API migration for XSS also made it easier to add proper ARIA attributes. The bundled approach produced a CLEAN review with no scope concerns, and the eval expansion covered both security and accessibility in one `check_accessibility()` function.

## Structural Threshold Ceiling on Zero-Dependency Projects
Discovered in e2e-test-recipes experiment #6 / run-97d30847 (2026-06-13).
When a project has zero external dependencies (no npm, no test framework, no linter, no type checker) AND `factory.md` guards forbid adding them, the factory eval composite score hits a structural ceiling. Hygiene dimensions (tests, lint, type_check, coverage) all score 0.5 because no tooling is detected, capping the maximum achievable composite at ~0.68 — well below the 0.8 precheck threshold. This means ALL experiments will be reverted regardless of code quality. In e2e-test-recipes, experiment #6 was reverted despite CLEAN CEO review, Reviewer PASS, and 1.0 project eval. H2 and H3 were skipped for the same reason. **Resolution options**: (1) relax the precheck threshold for zero-dependency projects, (2) adjust hygiene dimension scoring to account for intentional no-tooling stacks, or (3) allow the dependency guard to be selectively overridden. Until resolved, factory runs on such projects will burn compute on research/strategy/build without being able to merge anything.
