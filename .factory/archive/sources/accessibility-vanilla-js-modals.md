---
tags:
  - factory
  - source
  - accessibility
  - vanilla-js
source: factory-archivist
date: 2026-06-13
---

# Accessibility Best Practices: Vanilla JS Modals & Interactive Elements

## Focus Management in Modals

The #1 accessibility concern for the recipe viewer app:

- Use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` referencing the modal title (partially done in current app)
- Implement a focus trap: on modal open, move focus to the first focusable element; on Tab at the last focusable element, wrap to the first; on Shift+Tab at the first, wrap to the last
- On modal close, restore focus to the element that triggered the modal
- Set `aria-hidden="true"` on content behind the modal, or use the `inert` attribute on the rest of the page
- Escape key should close the modal (already implemented)
- Consider using `<dialog>` element with `.showModal()` which handles most accessibility automatically

## Interactive Elements

- Recipe cards should have `tabindex="0"` and `role="button"` with Enter/Space key handlers
- Filter buttons should toggle `aria-pressed` state
- Star rating should use `role="radiogroup"` with individual `role="radio"` and `aria-checked`
- Dynamic updates (search results, rating confirmation) should use `aria-live="polite"` regions

## Current App Gaps

- No focus trap in modal — Tab can escape into background content
- No focus restoration on modal close
- Recipe cards lack keyboard interaction (no tabindex, no role="button", no Enter/Space handlers)
- Filter buttons lack `aria-pressed` state
- Star rating lacks `role="radiogroup"` and individual `role="radio"` with `aria-checked`
- No skip-to-content link
- Color contrast not verified in both themes
- No `aria-live` regions for dynamic content updates

## Sources

- [UXPin: Accessible Modals with Focus Traps (2026)](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/)
- [WAI-ARIA 1.3 Specification](https://w3c.github.io/aria/)
- [MDN: ARIA Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [ARIA Labels Best Practices 2026](https://web-accessibility-checker.com/en/blog/aria-labels-best-practices)
- [NamasteDev: Keyboard Accessibility with Vanilla JS](https://namastedev.com/blog/keyboard-accessibility-with-vanilla-js/)
