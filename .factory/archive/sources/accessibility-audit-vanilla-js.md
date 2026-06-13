---
tags:
  - factory
  - source
source: factory-archivist
date: 2026-06-13
---

# Accessibility Audit Implementation — Vanilla JS

## Finding
The recipe viewer had zero accessibility support: cards were div-only (no keyboard access), modal had no focus management, filters had no ARIA state, star rating lacked semantic roles, and there was no skip-to-content link or focus-visible styles.

## Implementation Summary

### Skip-to-content
- `<a href="#main-content" class="skip-link">Skip to content</a>` before header
- CSS: `position: absolute; top: -40px` hidden, `top: 0` on `:focus`
- Target `<main>` gets `id="main-content"`

### Keyboard Navigation
- Recipe cards: `tabindex="0"`, `role="button"`, `aria-label="{title}"`, Enter/Space keydown handlers
- Star ratings: `tabindex="0"` on each star, Enter/Space keydown triggers click

### ARIA Attributes
- Filter buttons: `aria-pressed="true"/"false"` toggled on click
- Recipe grid: `aria-live="polite"` for dynamic content announcements
- Star rating container: `role="radiogroup"` with `aria-label="Rate this recipe"`
- Individual stars: `role="radio"`, `aria-checked`, `aria-label="{n} star(s)"`

### Focus Management
- Modal open: save `document.activeElement` to `modalTrigger`, focus `#modal-close`
- Modal close: restore focus to `modalTrigger`, null out reference

### Focus-visible Styles
- Consistent `outline: 2px solid var(--accent); outline-offset: 2px` on all interactive elements
- Uses `:focus-visible` (not `:focus`) to avoid outline on mouse clicks

## Eval Coverage
10 sub-checks covering all features: skip link (HTML + CSS), aria-live, focus-visible, tabindex, keyboard handlers (keydown + Enter + Space), aria-pressed, focus management (.focus()), XSS fix (textContent + createElement), radiogroup.
