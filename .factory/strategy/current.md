## Strategy — 2026-06-13

### Design Space
| Dimension | Score | Notes |
|---|---|---|
| Features | 4 | Search, filter, dark mode, ratings, PDF export all shipped |
| Bug fixes | 0 | XSS vulnerability found in buildReviewsHTML(), issue #2 open (invalid) |
| Instrumentation | 0 | Zero logging — observability score 0.0% |
| Flow changes | 0 | No refactors attempted |
| New agents | 0 | N/A for vanilla web app |
| Prompt engineering | 0 | N/A for vanilla web app |
| Eval improvements | 2 | Eval harness with 10 dimensions, PDF export checks added last cycle |
| Knowledge management | 1 | Archive has 12 source notes from prior cycles |
| Infrastructure | 0 | No CI/CD by design (vanilla app) |
| Operational execution | 0 | No pipelines to run |
| Self-evolution | 0 | N/A for this project type |

**Underserved:** Bug fixes (0), Instrumentation (0), Eval improvements (2)

### Observations
- Current composite score: 0.4635 (passed: false, threshold: 0.8)
- Project eval score: 1.0 across all 10 project dimensions — the low composite is entirely from factory hygiene/growth metrics
- Weakest eval dimensions: capability_surface (0.0), observability (0.0)
- Last experiment: Experiment 1 (PDF export) — KEEP, Δ n/a (first scored experiment)
- Pattern: All build phases shipped successfully with 0 reverts. The app is feature-complete for initial scope. The composite score is held back by capability_surface (0.0) and observability (0.0) — both growth dimensions that require new features and instrumentation to improve.
- GitHub issue #2 ("Fix recipe image not loading on mobile") is invalid — the app uses CSS gradients on `<div>` elements, not `<img>` elements with `srcset`. Research confirmed this thoroughly. Recommend closing as invalid with explanation.
- XSS vulnerability exists in `buildReviewsHTML()` at app.js:316 — user-submitted review text is inserted via innerHTML string concatenation without escaping. CEO explicitly flagged this for priority fix, bundled with first app.js change.
- Backlog has 2 items (accessibility audit, bookmarking). Both are well-researched with complete implementation plans in the archive.

### Hypotheses

#### H1: Fix XSS vulnerability and add accessibility audit with ARIA, keyboard navigation, and focus management
- **Category:** FIX
- **Type:** code
- **Backlog item:** Add accessibility audit — ARIA labels, keyboard navigation, contrast ratios in both themes
- **Growth dimension:** capability_surface
- **What:** Two changes bundled per CEO direction (XSS fix bundled with first app.js change):

  **XSS fix** (app.js:312-318): Replace string concatenation in `buildReviewsHTML()` with DOM API. Use `document.createElement('div')` + `textContent = r.text` instead of concatenating `r.text` directly into an innerHTML string. This prevents script injection from user-submitted reviews.

  **Accessibility audit** — scoped to highest-impact items:
  1. **`index.html`** — Add a skip-to-content link (`<a href="#recipe-grid" class="skip-link">Skip to content</a>`) as first child of `<body>`. Add `aria-live="polite"` wrapper around the recipe grid or a separate status element to announce search/filter result counts to screen readers.
  2. **`app.js`** — Add `tabindex="0"` and `role="button"` to recipe cards in `renderRecipeCard()`. Add `keydown` event listener on each card for Enter and Space keys to open the modal. Toggle `aria-pressed` attribute on filter buttons when category changes. Update the aria-live region with result count text when `renderRecipes()` runs (e.g., "Showing 3 recipes"). Add focus management: store reference to the triggering card before opening modal, move focus into the modal on open (`modal.focus()` or first focusable element), restore focus to triggering card on close. Add `role="radiogroup"` to the star rating container and `role="radio"` with `aria-checked` to individual star spans in `openModal()`.
  3. **`styles.css`** — Add `.skip-link` styles: visually hidden by default (`position: absolute; left: -9999px`), visible on focus (`position: static` or similar). Add `:focus-visible` outline styles for `.recipe-card`, `.filter-btn`, `.modal-close`, `.star`, and `.export-pdf-btn` with `outline: 2px solid var(--accent); outline-offset: 2px;` for keyboard focus visibility.
  4. **`eval/score.py`** — Add `check_accessibility()` function verifying: `tabindex` attribute appears on card elements (in JS), `role="button"` on cards, `aria-pressed` in filter button logic, `skip-link` or `skip-to-content` exists in HTML, `aria-live` region exists, `:focus-visible` styles exist in CSS, review rendering uses `textContent` (XSS safety check — no raw string concatenation with `.text` into innerHTML). Wire into scored dimensions with appropriate weight.

- **Why:** The XSS in `buildReviewsHTML()` is a real security vulnerability — any user who submits a review containing `<script>` tags can execute arbitrary JS for all future viewers. The CEO explicitly prioritized this fix. The accessibility backlog item addresses the largest remaining usability gap — recipe cards are not keyboard-navigable, filter buttons don't communicate state to assistive technology, and the modal lacks focus management. The archive contains thorough research on all these ARIA patterns (`accessibility-vanilla-js-modals.md`, `native-dialog-element-modals.md`). Bundling saves a PR cycle since both heavily modify app.js.
- **Expected impact:** capability_surface 0.0 → improved (new ARIA roles, keyboard handlers, focus management, skip link add measurable public surface). New `check_accessibility` eval dimension with ~7 checks contributes to project eval. Project eval maintains 1.0.
- **Priority:** high

#### H2: Add recipe bookmarking/favorites with localStorage persistence
- **Category:** EXPLORE
- **Type:** code
- **Backlog item:** Add recipe bookmarking/favorites with localStorage persistence
- **Growth dimension:** capability_surface
- **What:** Add a favorites system following the proven localStorage multi-key pattern already used by ratings, reviews, and theme:

  1. **`app.js`** — Add `loadFavorites()` / `saveFavorites()` / `toggleFavorite(recipeId)` functions storing an array of recipe IDs in `recipe-favorites` localStorage key. In `renderRecipeCard()`, add a heart button element (`<button class="favorite-btn">`) with filled heart (❤) when favorited and empty heart (♡) when not. Attach click handler that calls `toggleFavorite()` and calls `event.stopPropagation()` to prevent opening the modal. Add a "Favorites" filter button to the category filter bar — when active, `getFilteredRecipes()` additionally filters to only favorited IDs. When no favorites exist and the Favorites filter is active, show a helpful message ("No favorites yet — click the heart on any recipe to save it"). Also show the heart icon state in the modal view for consistency.
  2. **`styles.css`** — Style `.favorite-btn`: positioned top-right of card image area with `position: absolute`, transparent background, large heart icon. Add `.favorite-btn.favorited` state with filled heart color using `var(--accent)`. Hover/active transitions. Style the Favorites filter button consistently with existing `.filter-btn` pills. Ensure all colors use CSS custom properties for dark mode compatibility.
  3. **`eval/score.py`** — Add `check_favorites()` function verifying: `recipe-favorites` string appears in JS, `loadFavorites` or equivalent function exists, `toggleFavorite` or equivalent function exists, favorite button element rendered in card (`.favorite-btn` or similar class in JS), `Favorites` or `favorites` appears in filter logic, `localStorage` used with favorites key. Wire into scored dimensions.

- **Why:** This is the second backlog item. The localStorage multi-key pattern is proven across 4 existing keys (`recipe-ratings`, `rated-recipes`, `recipe-reviews`, `theme`). The archive source note (`localstorage-bookmarking-favorites.md`) contains a complete implementation plan aligned with the existing codebase. Low risk, well-understood feature that adds meaningful user interaction and increases capability surface.
- **Expected impact:** capability_surface 0.0 → improved (new functions: loadFavorites, saveFavorites, toggleFavorite; new UI: heart buttons, Favorites filter). New `check_favorites` eval dimension with ~6 checks. Project eval maintains 1.0.
- **Priority:** medium

#### H3: Add structured logging and observability instrumentation
- **Category:** EXPLORE
- **Type:** code
- **New:**
- **Growth dimension:** observability
- **What:** Add zero-dependency structured logging to the app:

  1. **`app.js`** — Add a `logger` object at the top of the file (after recipe data) with three methods: `info(event, data)`, `warn(event, data)`, `error(event, data)`. Each outputs structured JSON via the corresponding `console` method: `console.log(JSON.stringify({level: 'info', event, ...data, ts: Date.now()}))`. Instrument key user interactions with one-line log calls:
     - `renderRecipes()`: `logger.info('recipes_rendered', {count: filtered.length, category: activeCategory, query: searchQuery})`
     - Category filter click: `logger.info('filter_change', {category: activeCategory})`
     - `openModal()`: `logger.info('modal_open', {recipeId: recipe.id, title: recipe.title})`
     - `closeModal()`: `logger.info('modal_close', {})`
     - `addRating()`: `logger.info('rating_submitted', {recipeId, value})`
     - `addReview()`: `logger.info('review_submitted', {recipeId})`
     - PDF export click: `logger.info('pdf_export', {recipeId: recipe.id})`
     - `toggleTheme()`: `logger.info('theme_toggle', {theme: newTheme})`
     - Add `window.onerror = function(msg, src, line) { logger.error('uncaught_error', {message: msg, source: src, line: line}); }` at the top level.
     - Wrap existing localStorage try/catch blocks to log warnings: `logger.warn('storage_read_error', {key: 'recipe-ratings', error: e.message})`.
  2. **`eval/score.py`** — Add `check_observability()` function verifying: a `logger` object or logging function definition exists in app.js, `JSON.stringify` is used in logging calls, `window.onerror` handler exists, `console.log` or `console.warn` or `console.error` calls exist (beyond the logger definition itself), at least 5 distinct `logger.info` / `logger.warn` / `logger.error` call sites exist. Wire into scored dimensions.

- **Why:** Observability is at 0.0% — the app has zero log statements. The factory eval's observability dimension checks for function coverage, structured logging, and error handling — all currently at zero. A lightweight structured logger using native `console` methods satisfies the zero-dependency constraint while providing meaningful instrumentation. Research confirms this is the recommended approach for vanilla JS apps (no external logging libraries needed). This is the third growth hypothesis, targeting the observability dimension specifically.
- **Expected impact:** observability 0.0 → 0.5+ (structured logging present via JSON.stringify, function coverage increases with logger calls in 8+ functions, window.onerror handled). New `check_observability` eval dimension adds coverage.
- **Priority:** medium

### Anti-patterns to Avoid
- **innerHTML with user input**: The current XSS in `buildReviewsHTML()` is the exact pattern to avoid. Always use `textContent` or `createElement` for user-submitted content. Never concatenate user strings into innerHTML.
- **External dependencies for any feature**: The factory.md guard forbids all external deps. No ARIA/a11y libraries, no icon fonts (use Unicode hearts ❤/♡ for favorites), no logging frameworks like loglevel or pino.
- **Overscoping accessibility to full WCAG AAA**: Full AAA compliance is too large for one PR. Focus on WCAG 2.1 A/AA: keyboard nav, ARIA roles, focus management, skip link. Color contrast verification is noted but doesn't require automated tooling this cycle.
- **Complex manual focus trap**: The current div-based modal already has Escape-to-close. A simple focus-on-open + focus-restore-on-close is sufficient. A full focus trap (intercepting Tab at boundaries) adds complexity with diminishing returns for a demo app.
- **Logging sensitive or user-generated content**: Don't log review text content or personal data in structured logs — log events and metadata only (recipe IDs, categories, counts).
- **Overwriting existing eval checks**: Each new `check_*` function must be additive. Do not modify `check_pdf_export()`, `check_rating_system()`, or any existing check functions — only add new ones and wire them into the composite calculation.

### New Backlog Items
- Resolve GitHub issue #2 — close as invalid with explanation (all recipe images are CSS gradients rendered as `background` styles on `<div>` elements; no `<img>` elements or `srcset` attributes exist in the codebase), or redefine as "Add real recipe images with responsive srcset" (new feature that would require addressing the self-contained data constraint)
