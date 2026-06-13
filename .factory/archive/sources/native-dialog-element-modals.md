---
tags:
  - factory
  - source
  - e2e-test-recipes
  - accessibility
source: factory-archivist
date: 2026-06-13
---

# Native `<dialog>` Element for Accessible Modals

## Finding

The HTML `<dialog>` element with `showModal()` is the modern standard for accessible modals (97% browser support as of 2026). It provides:

- Built-in focus trapping (browser-managed, no custom JS)
- Automatic `role="dialog"` and `aria-modal="true"`
- Native Escape key dismissal
- `::backdrop` pseudo-element for overlay styling
- W3C APA Working Group confirmed native dialog behavior (allowing tab to browser chrome) is the correct accessible approach

## Recommendation

Migrate the current `div.modal-backdrop` + `div.modal` implementation to a `<dialog>` element. This eliminates custom focus trap code while significantly improving accessibility. The migration removes code rather than adding it.

## Sources

- [UXPin: Accessible Modals with Focus Traps (2026)](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/)
- [CSS-Tricks: No Need to Trap Focus on Dialog Element](https://css-tricks.com/there-is-no-need-to-trap-focus-on-a-dialog-element/)
- [MDN: `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [NamasteDev: Keyboard Accessibility with Vanilla JS](https://namastedev.com/blog/keyboard-accessibility-with-vanilla-js-focus-shortcuts-and-aria-hooks/)
- [NamasteDev: Building Accessible Components with Vanilla JS](https://namastedev.com/blog/building-accessible-components-with-vanilla-javascript-2/)

## Context

Discovered during run-0db0b721 improvement study (2026-06-13). Supplements the existing `accessibility-vanilla-js-modals.md` gap analysis with a concrete migration path.
