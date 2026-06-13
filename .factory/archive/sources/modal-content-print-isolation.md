---
tags:
  - factory
  - source
  - e2e-test-recipes
source: factory-archivist
date: 2026-06-11
---

# Printing Only Modal Content

## Summary

Techniques for isolating modal content when using `window.print()`, so only the recipe detail (not the full page) appears in the PDF output.

## Approaches

### Approach A — CSS Visibility Trick (Recommended)
Hide all body children via `visibility: hidden`, then make the modal content visible and absolutely positioned at (0,0). No JavaScript DOM manipulation needed.

```css
@media print {
  body * { visibility: hidden; }
  #modal-content, #modal-content * { visibility: visible; }
  #modal-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
```

### Approach B — CSS Class Toggle
Add a `.printing` class to `<body>` before calling `window.print()`, remove afterward. The `afterprint` event cleans up automatically. More complex, less necessary for this use case.

## Recipe Content Formatting

- **Title**: 16pt-18pt bold heading
- **Metadata**: Category, prep time, servings on a single line
- **Ingredients**: Bulleted list with `break-inside: avoid`
- **Instructions**: Numbered list with `line-height: 1.6`
- **Image**: Recipe card images are CSS gradients — hide in print (saves ink)
- **Rating**: Optionally include as text (e.g., "4.2 (5 ratings)")
- **Hidden elements**: Star hover UI, review textarea, submit button, close button, export button

## Sources

- [GitHub Gist — Print certain div using window.print()](https://gist.github.com/andrewlimaza/490a69417d9fe2df3f668195a7661605)
- [Bootstrap Issue #35819 — Modal print](https://github.com/twbs/bootstrap/issues/35819)
