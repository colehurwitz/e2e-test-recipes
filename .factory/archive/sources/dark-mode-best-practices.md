---
tags:
  - factory
  - source
  - e2e-test-recipes
source: factory-archivist
date: 2026-06-11
---

# Dark Mode Implementation Best Practices

Research into dark mode toggle implementation for vanilla HTML/CSS/JS apps.

## Key Findings

- **CSS custom properties (variables)** on `:root` with a `color-mode` attribute — define light/dark palettes as variable sets
- **Toggle via data attribute** on `<html>` element (e.g., `data-theme="dark"`)
- **localStorage persistence** so the choice survives page reloads
- **Respect `prefers-color-scheme`** media query as default when no user preference is stored
- **Inline script in `<head>`** to prevent flash of unstyled content (FOUC)
- **`color-scheme` meta tag** so browser-native elements (scrollbars, form controls) adapt
- Priority chain: saved site preference > OS preference > HTML default

## Implementation Approach

- Define light/dark color palettes as CSS custom property sets under `:root[data-theme="light"]` and `:root[data-theme="dark"]`
- Toggle button in header (sun/moon icons or simple text toggle)
- JavaScript: toggle `data-theme` attribute on `<html>`, persist to localStorage
- Inline `<head>` script to apply saved/OS theme before first paint

**Complexity: Low** — if CSS variables are used from the start, adding dark mode is primarily defining a second set of color values and adding a toggle button.

## Sources

- [CSS-Tricks — Complete Guide to Dark Mode on the Web](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/)
- [Ryan Feigenbaum — The Complete Guide to the Dark Mode Toggle](https://ryanfeigenbaum.com/dark-mode/)
- [W3Schools — Toggle Dark/Light Mode](https://www.w3schools.com/howto/howto_js_toggle_dark_mode.asp)
