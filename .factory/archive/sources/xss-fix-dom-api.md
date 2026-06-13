---
tags:
  - factory
  - source
source: factory-archivist
date: 2026-06-13
---

# XSS Fix via DOM API Migration

## Finding
The `buildReviewsHTML()` function at app.js:316-318 concatenated user-supplied review text directly into an innerHTML assignment via string concatenation: `'<div class="review-text">' + r.text + '</div>'`. This is a textbook stored XSS vulnerability — any user who enters `<script>` tags or event handlers in a review can execute arbitrary JavaScript.

## Fix Applied
Renamed to `buildReviewsDOM()` and migrated to DOM API:
- `document.createElement("div")` for container, items, and text elements
- `textContent = r.text` for safe text insertion (auto-escapes HTML entities)
- Returns a DOM node (or null for empty reviews) instead of an HTML string
- Callers updated to use `appendChild()` instead of `innerHTML =`

## Why This Approach
The DOM API approach is the canonical fix for innerHTML XSS in vanilla JS. Alternatives considered:
- **DOMPurify/sanitizer library**: Forbidden by factory.md (no external dependencies)
- **Manual escaping**: Error-prone, easy to miss edge cases (`&`, `<`, `>`, `"`, `'`)
- **textContent on a wrapper**: What was chosen — zero risk of HTML interpretation

## Applicability
Any vanilla JS app using innerHTML with user-generated content should prefer DOM API with textContent. This pattern is simpler than sanitization and impossible to bypass.
