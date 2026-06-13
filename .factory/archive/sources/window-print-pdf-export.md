---
tags:
  - factory
  - source
  - e2e-test-recipes
source: factory-archivist
date: 2026-06-11
---

# window.print() + CSS @media print for PDF Export

## Summary

The browser's native `window.print()` API combined with CSS `@media print` rules is the only viable zero-dependency approach for exporting recipe content to PDF. When called, it opens the browser's print dialog which includes a "Save as PDF" destination on all major desktop browsers.

## Key Findings

- **No external dependencies needed** — this is critical because the project's `factory.md` guard forbids npm packages, CDN libraries, and build tools. jsPDF, html2pdf.js, pdfmake are all ruled out.
- **Universal browser support** — `window.print()`, `@media print`, and `@page { margin }` work in Chrome, Firefox, Safari, and Edge.
- **User must interact with print dialog** — there is no way to bypass this in vanilla JS. A `window.exportPdf()` API has been proposed but is not implemented.
- **Mobile support is limited** — `window.print()` has limited support on mobile browsers, acceptable for a demo/test app.

## Implementation Approach

1. Add "Export to PDF" button in recipe detail modal
2. Button calls `window.print()`
3. CSS `@media print` rules hide everything except recipe content
4. `<title>` tag value becomes the default PDF filename

## Sources

- [MDN — Window.print()](https://developer.mozilla.org/en-US/docs/Web/API/Window/print)
- [DEV Community — Simple way to generate PDF from HTML](https://dev.to/climentea/simple-way-to-generate-pdf-from-html-21mh)
