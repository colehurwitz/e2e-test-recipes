---
tags:
  - factory
  - source
  - e2e-test-recipes
  - github-issue
source: factory-archivist
date: 2026-06-13
---

# GitHub Issue #2: Recipe Image Not Loading on Mobile — Invalid

## Finding

Issue #2 ("Fix recipe image not loading on mobile") describes malformed `srcset` attributes causing image load failures on iOS Safari. This does **not match** the current codebase — there are no `<img>` elements and no `srcset` attributes anywhere in the code.

All recipe "images" are CSS gradients rendered as `background` styles on `<div>` elements:

```js
image: "linear-gradient(135deg, #f6d365, #fda085)",
// rendered as:
<div class="recipe-card-image" style="background: ${recipe.image}">
```

## Safari Gradient Research

Mobile Safari has known gradient issues, but the app uses simple `linear-gradient()` with hex color stops — the most compatible form. Known Safari issues involve:
- `transparent` keyword interpolation
- `rgba()` vs `rgb()` with alpha
- `background-clip: text`

None of these apply to the current implementation.

## Recommendation

Close issue #2 as invalid, OR redefine as "Add real recipe images with proper responsive srcset" (a new feature, not a bug fix). Since the config guard forbids external APIs and images must be self-contained, CSS gradients are the correct approach for this demo app.

## Sources

- [Ambient Impact: Safari Bug with Gradients that Fade to Transparent](https://ambientimpact.com/web/snippets/safari-bug-with-gradients-that-fade-to-transparent)
- [Medium: Gradient Support in Safari](https://medium.com/@harshkurra21/gradient-support-in-safari-546794bce33f)
- [Apple Developer Forums: linear-gradient and color-mix](https://developer.apple.com/forums/thread/749590)
