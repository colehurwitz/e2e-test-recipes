---
tags:
  - factory
  - source
  - e2e-test-recipes
source: factory-archivist
date: 2026-06-11
---

# CSS Print Stylesheet Best Practices

## Summary

Best practices for CSS `@media print` stylesheets, specifically applied to isolating modal content for recipe PDF export.

## Key Techniques

### Hiding Non-Print Elements
Use `visibility: hidden` on `body *` and `visibility: visible` on the target section. This is more reliable than `display: none` because `display: none` on a parent prevents children from showing even if overridden.

### Page Setup
```css
@page {
  size: letter;
  margin: 20mm 15mm;
}
```
Note: `@page { size }` is Chromium-only but degrades gracefully.

### Preserving Backgrounds/Colors
Browsers strip backgrounds by default. Override with:
```css
print-color-adjust: exact;
-webkit-print-color-adjust: exact;
```

### Page Break Control
- `break-inside: avoid` — keep ingredient/instruction lists from splitting across pages
- `break-after: avoid` on headings — prevent orphaned headings at page bottom

### Typography for Print
- Use `pt` units for font sizes (e.g., `12pt`)
- Set `color: #000` on `background: #fff` for high contrast
- `orphans: 3; widows: 3` on paragraphs/list items

### Browser Compatibility
| Feature | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| `@media print` | Yes | Yes | Yes | Yes |
| `@page { size }` | Yes | No | No | Yes |
| `break-inside: avoid` | Yes | Yes | Partial | Yes |
| `print-color-adjust` | Yes | Yes | Prefix | Yes |

## Sources

- [Converterer Blog — Print CSS Basics](https://www.converterer.com/blog/print-css-basics/)
- [PDF4.dev — CSS Print Styles Complete Guide](https://pdf4.dev/blog/css-print-styles-pdf-guide)
- [CustomJS — Print CSS Cheatsheet](https://www.customjs.space/blog/print-css-cheatsheet/)
