---
tags:
  - factory
  - source
  - bookmarking
  - localstorage
source: factory-archivist
date: 2026-06-13
---

# localStorage Bookmarking/Favorites Pattern

## Standard Pattern for Vanilla JS

1. **Data structure**: Store an array of recipe IDs as JSON: `JSON.parse(localStorage.getItem('favorites')) || []`
2. **Toggle pattern**: Click handler checks if ID exists in array — if yes, splice/filter it out; if no, push it in. Re-serialize and save.
3. **Render sync**: On page load, read favorites array and apply visual state (filled heart icon, "favorited" class) to matching cards
4. **Separate key**: Use a dedicated localStorage key (`recipe-favorites`) — the project already follows this multi-key pattern for ratings, reviews, and theme
5. **Edge cases**: Handle empty array on first visit, invalid JSON (wrap in try/catch), and visual feedback on toggle (heart animation, toast notification)

## Alignment with Existing Codebase

This aligns well with the project's existing localStorage patterns:
- `loadRatings()` — reads `recipe-ratings` key
- `loadReviews()` — reads `recipe-reviews` key
- `loadRatedRecipes()` — reads `rated-recipes` key
- Theme persistence via `theme` key

The favorites/bookmarking feature should follow this same multi-key pattern with a `recipe-favorites` key.

## Implementation Notes

- Heart/bookmark icon on each recipe card for toggle
- "Favorites" filter option in the category filter bar (or separate toggle)
- Visual indicator on favorited cards (filled heart, subtle background)
- Low risk — the localStorage multi-key pattern is already proven in this codebase

## Sources

- [DEV Community: Bookmarker App with LocalStorage](https://dev.to/abthakur/a-simple-bookmarker-app-with-localstorage-2j5)
- [CodePen: Simple localStorage Favorite List](https://codepen.io/83338/pen/KdVPLd)
- [SiteKickr: Add to Favorites with JavaScript](https://www.sitekickr.com/blog/add-favorites-javascrip/)
