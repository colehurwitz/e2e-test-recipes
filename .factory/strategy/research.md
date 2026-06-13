# Research Report

## Project Summary

A self-contained recipe viewer web app built with vanilla HTML/CSS/JS (no frameworks, no build tools, no external dependencies). The app has 6 hardcoded recipes with search, category filtering, detail modal, dark mode toggle, 5-star rating/review system, and PDF export via `window.print()`. All features were built across 5 experiments (4 build phases + 1 PDF export cycle) with 0 reverts.

**Current state:**
- Composite eval score: 0.4385 (failing, threshold 0.8)
- The project eval itself scores 1.0 across all 10 project dimensions — the low composite is due to factory hygiene/growth metrics (capability_surface: 0.0, observability: 0.0)
- Open issue: GitHub #2 (mobile images)
- Backlog: 2 items (accessibility audit, recipe bookmarking)
- 5 experiments completed, all KEEP

## GitHub Issue #2 Analysis

**Issue:** "Fix recipe image not loading on mobile" — filed by @colehurwitz. Description: "Recipe images fail to load on iOS Safari. The srcset attribute appears to be malformed for mobile viewport sizes."

**Finding:** The issue description does NOT match the current codebase. All recipe "images" are CSS gradients rendered as `background` styles on `<div>` elements — there are no `<img>` elements and no `srcset` attributes anywhere in the code:

```js
image: "linear-gradient(135deg, #f6d365, #fda085)",
// rendered as:
<div class="recipe-card-image" style="background: ${recipe.image}">
```

**Safari gradient research:** Mobile Safari has known issues with CSS gradients, but the app uses simple `linear-gradient()` with hex color stops — the most compatible form. Known Safari issues involve `transparent` keyword interpolation, `rgba()` vs `rgb()` with alpha, and `background-clip: text` — none apply here.

**Recommendation:** Close issue #2 as invalid, OR redefine it as "Add real recipe images with proper responsive srcset" — which would be a new feature, not a bug fix. Since the config guard forbids external APIs and images must be self-contained, CSS gradients are the correct approach for this demo app.

Sources:
- [Ambient Impact: Safari Bug with Gradients that Fade to Transparent](https://ambientimpact.com/web/snippets/safari-bug-with-gradients-that-fade-to-transparent)
- [Medium: Gradient Support in Safari](https://medium.com/@harshkurra21/gradient-support-in-safari-546794bce33f)
- [Apple Developer Forums: linear-gradient and color-mix](https://developer.apple.com/forums/thread/749590)

## External Research Findings

### 1. Accessibility — Keyboard Navigation & ARIA (backlog item)

The archive already contains thorough research (`accessibility-vanilla-js-modals.md`, `native-dialog-element-modals.md`, `wcag-contrast-dark-mode.md`). Web search confirmed and supplemented:

**Card grid keyboard navigation (WCAG 2.1.1):**
- Recipe cards currently lack `tabindex`, `role`, and keyboard event handlers
- Recommended pattern: add `tabindex="0"` and `role="button"` to each card, with Enter/Space key handlers to open the modal
- For a simple grid of cards, the full ARIA grid pattern (`role="grid"`) is overkill — individual focusable cards with `role="button"` is sufficient
- Focus indicators must meet WCAG 2.2's Focus Appearance criterion (2.4.13)

**Modal accessibility — `<dialog>` migration:**
- Native `<dialog>` element with `.showModal()` is the modern standard (97% browser support)
- Provides: built-in focus trapping, automatic `role="dialog"` and `aria-modal="true"`, native Escape dismissal, `::backdrop` pseudo-element
- W3C APA Working Group confirmed native dialog behavior is the correct accessible approach
- Migration from `div.modal-backdrop` to `<dialog>` removes code while adding accessibility

**Other accessibility gaps (from archive):**
- Filter buttons need `aria-pressed` state toggling
- Star rating needs `role="radiogroup"` / `role="radio"` with `aria-checked`
- Search results need `aria-live="polite"` region for screen reader announcements
- No skip-to-content link
- Color contrast unverified — `--text-secondary` values need checking against WCAG AA (4.5:1 for normal text)

Sources:
- [UXPin: Keyboard Navigation Patterns for Complex Widgets (2026)](https://www.uxpin.com/studio/blog/keyboard-navigation-patterns-complex-widgets/)
- [UXPin: WCAG 2.1.1 Keyboard Accessibility Explained](https://www.uxpin.com/studio/blog/wcag-211-keyboard-accessibility-explained/)
- [UXPin: Accessible Modals with Focus Traps (2026)](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/)
- [CSS-Tricks: No Need to Trap Focus on Dialog Element](https://css-tricks.com/there-is-no-need-to-trap-focus-on-a-dialog-element/)
- [W3C: All WCAG 2.2 Techniques](https://www.w3.org/WAI/WCAG22/Techniques/)
- [TheWCAG: Accessible Navigation Example 2026](https://www.thewcag.com/examples/navigation)
- [HAN Accessibility Lab: Keyboard Navigation WCAG Guide](https://ngi.aimsites.nl/keyboard-navigation-wcag-guide-complete-tutorial-for-developers/)

### 2. localStorage Bookmarking/Favorites (backlog item)

The archive has a complete source note (`localstorage-bookmarking-favorites.md`). The pattern is well-established and aligns perfectly with the existing codebase:

- Store recipe IDs in `recipe-favorites` localStorage key (follows existing multi-key pattern: `recipe-ratings`, `rated-recipes`, `recipe-reviews`, `theme`)
- Toggle: click handler checks array membership, adds or removes ID, re-serializes
- Visual: heart/bookmark icon on each card with filled/unfilled states
- Filter: add "Favorites" to category filter bar or separate toggle button
- Render sync: on page load, read favorites and apply visual state to matching cards
- Low risk — the localStorage multi-key pattern is already proven in 4 other keys

Sources:
- [DEV Community: Bookmarker App with LocalStorage](https://dev.to/abthakur/a-simple-bookmarker-app-with-localstorage-2j5)
- [SiteKickr: Add to Favorites with JavaScript](https://www.sitekickr.com/blog/add-favorites-javascrip/)
- [CodePen: Simple localStorage Favorite List](https://codepen.io/83338/pen/KdVPLd)

### 3. Observability for Vanilla JS (growth dimension, score 0.0)

The app has zero log statements, no structured logging, no error handling instrumentation. For a demo/test app with no backend, full observability tooling is overkill — but basic instrumentation satisfies the growth dimension and demonstrates good practice.

**Recommended approach (zero-dependency):**

A lightweight console.log wrapper providing structured JSON logging:

```js
const logger = {
    info: (event, data) => console.log(JSON.stringify({ level: 'info', event, ...data, ts: Date.now() })),
    warn: (event, data) => console.warn(JSON.stringify({ level: 'warn', event, ...data, ts: Date.now() })),
    error: (event, data) => console.error(JSON.stringify({ level: 'error', event, ...data, ts: Date.now() })),
};
```

**What to instrument:**
- User interactions: search queries, category filter changes, modal open/close, rating submissions, review submissions, PDF exports, theme toggles
- Errors: localStorage read/write failures, malformed data recovery
- `window.onerror` global handler for uncaught exceptions

The eval can verify: (a) a logger/logging function exists, (b) log calls are present in key functions, (c) `window.onerror` is handled.

Sources:
- [Sentry: JavaScript Logging Library Definitive Guide 2026](https://blog.sentry.io/javascript-logging-library-definitive-guide/)
- [SitePoint: Logging Errors in Client-Side Applications](https://www.sitepoint.com/logging-errors-client-side-apps/)
- [Stackify: JavaScript Logging Basic Tips](https://stackify.com/javascript-logging-basic-tips/)
- [GitHub: loglevel — Minimal Lightweight Logging for JavaScript](https://github.com/pimterry/loglevel)

### 4. XSS Vulnerability in Review Rendering (from archive)

The archive (`xss-vulnerability-review-rendering.md`) identified a critical XSS vulnerability at `app.js:316-318` — `buildReviewsHTML()` inserts user-submitted review text directly into innerHTML without escaping:

```js
return '<div class="review-item"><div class="review-text">' + r.text + '</div></div>';
```

**Fix:** Use `document.createElement` + `textContent` instead of string concatenation with innerHTML, or escape HTML entities (`<`, `>`, `&`, `"`, `'`) before insertion. The `textContent` approach is preferred as simpler and handles all edge cases.

## Prior Knowledge (Archive)

The archive is extensive (12 source notes, 9 cross-project patterns, 5 experiment notes, 2 cycle summaries, 6 strategy snapshots):

**Directly relevant source notes:**
- `accessibility-vanilla-js-modals.md` — comprehensive gap analysis with exact ARIA attributes and roles needed per component
- `native-dialog-element-modals.md` — `<dialog>` migration path (removes code, adds accessibility)
- `wcag-contrast-dark-mode.md` — WCAG AA contrast requirements, specific color pairs to verify
- `localstorage-bookmarking-favorites.md` — complete implementation plan aligned with existing codebase patterns
- `xss-vulnerability-review-rendering.md` — innerHTML XSS in `buildReviewsHTML()`, fix approach documented

**Relevant patterns:**
- **Eval-first development**: Adding eval checks before implementing features works well (proven in PDF export: 0.442 → 1.0)
- **Incremental eval expansion**: Each phase adds new dimension-specific checks without modifying existing ones
- **localStorage multi-key pattern**: Partition state by concern (`recipe-ratings`, `rated-recipes`, `recipe-reviews`) — already proven across 4 keys
- **CSS custom property front-loading**: All colors use CSS vars, making new features theme-compatible by default

## Recommended Focus Areas

Ranked by expected impact, following FEEC ordering (FIX > EXPLOIT > EXPLORE > COMBINE):

### 1. FIX: XSS vulnerability in `buildReviewsHTML()` — HIGH priority
- **Impact:** Security fix, demonstrates code quality. Low effort (textContent swap).
- **Growth dimension:** capability_surface
- **Files:** `app.js`, `eval/score.py` (add XSS safety check)
- **Bundle with:** whichever hypothesis touches `app.js` first

### 2. FIX/EXPLOIT: Accessibility audit — HIGH priority (backlog item)
- **Impact:** Largest improvement opportunity. Clears backlog item, fixes real usability gaps, adds significant capability surface. The `<dialog>` migration is the single highest-impact change (removes code while adding accessibility).
- **Growth dimension:** capability_surface
- **Scope:** Migrate modal to `<dialog>`, add tabindex/role/keydown to cards, aria-pressed to filters, aria-live for search, skip-to-content link, verify contrast, ARIA roles on star rating
- **Files:** `index.html`, `app.js`, `styles.css`, `eval/score.py`

### 3. EXPLOIT: Recipe bookmarking/favorites — MEDIUM priority (backlog item)
- **Impact:** Clears backlog item, adds user-facing feature, follows proven localStorage pattern
- **Growth dimension:** capability_surface
- **Scope:** Heart icon on cards, toggle logic, "Favorites" filter option, localStorage persistence
- **Files:** `app.js`, `styles.css`, `eval/score.py`

### 4. EXPLORE: Structured logging/observability — MEDIUM priority
- **Impact:** Observability score 0.0 → non-zero, satisfies growth dimension requirement
- **Growth dimension:** observability
- **Scope:** Console.log wrapper, instrumentation in key functions, window.onerror handler
- **Files:** `app.js`, `eval/score.py`

### 5. FIX: Resolve GitHub issue #2 — LOW priority
- **Impact:** Closes open issue. The bug as described (malformed srcset) doesn't exist in current code — images are CSS gradients.
- **Action:** Close as invalid with explanation, or redefine as new feature scope
