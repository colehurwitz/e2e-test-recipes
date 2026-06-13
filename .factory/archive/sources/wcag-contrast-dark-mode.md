---
tags:
  - factory
  - source
  - e2e-test-recipes
  - accessibility
source: factory-archivist
date: 2026-06-13
---

# WCAG 2.2 Contrast Requirements for Dark Mode

## Finding

Both light and dark themes must independently meet WCAG AA contrast requirements:

- Normal text: 4.5:1 minimum
- Large text (18pt+ or 14pt bold+): 3:1
- UI components and borders: 3:1
- Focus indicators: 3:1 against adjacent colors (new in WCAG 2.2)

## Project-Specific Concerns

The following color pairings in the current codebase need verification:

- `--text-secondary: #6c757d` on `--bg-primary: #f8f9fa` (light theme)
- `--text-secondary: #a1a1aa` on `--bg-primary: #121212` (dark theme)
- Placeholder text color in search input (browser defaults often fail contrast)
- Pure white (#e4e4e7) on near-black (#121212) has 18:1 which passes, but accent colors need checking

## Common Dark Mode Pitfalls

- Offering dark mode does NOT satisfy WCAG contrast requirements — each theme must be verified independently
- Browser default placeholder text often fails contrast in dark themes
- Accent/highlight colors that pass in light mode may fail in dark mode

## Sources

- [WebAIM: Contrast and Color Accessibility](https://webaim.org/articles/contrast/)
- [BOIA: Dark Mode Doesn't Satisfy WCAG Contrast Requirements](https://www.boia.org/blog/offering-a-dark-mode-doesnt-satisfy-wcag-color-contrast-requirements)
- [MakeThingsAccessible: WCAG 2.2 Level AA Contrast](https://www.makethingsaccessible.com/guides/contrast-requirements-for-wcag-2-2-level-aa/)
- [Color Contrast WCAG Requirements 2026 Guide](https://web-accessibility-checker.com/en/blog/color-contrast-wcag-guide)

## Context

Discovered during run-0db0b721 improvement study (2026-06-13). Relevant to the accessibility audit backlog item — contrast verification should be part of the eval expansion.
