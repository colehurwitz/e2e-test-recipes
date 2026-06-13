---
tags:
  - factory
  - source
  - e2e-test-recipes
source: factory-archivist
date: 2026-06-11
---

# Recipe Viewer App Patterns

Survey of ~10 recipe viewer implementations from tutorials and GitHub projects.

## Key Findings

- **Vanilla HTML/CSS/JS** is the dominant approach for simple recipe apps — no framework needed
- Most tutorials use a **single HTML file** with JS-driven rendering for simplicity
- Data sources: hardcoded JSON, local JSON file, or external API (TheMealDB is popular but adds external dependency)
- Common features: recipe cards, search/filter, detail views, bookmarks
- CSS Grid/Flexbox is standard for recipe card layouts

## Recommendation for This Project

- Vanilla HTML + CSS + JavaScript — zero dependencies, instant testability, no build step
- Single `index.html`, `styles.css`, and `app.js`
- Hardcoded JSON array in JS (avoids network flakiness for testing)
- 5-8 sample recipes with title, image placeholder, ingredients, instructions, category
- Single-page with JS rendering — no routing needed

## Sources

- [DEV Community — Build a Recipe App with Vanilla JavaScript](https://dev.to/codewithsadee/how-to-build-a-recipe-app-with-vanilla-javascript-1ogm)
- [GeeksforGeeks — Design a Recipe App in HTML CSS & JavaScript](https://www.geeksforgeeks.org/javascript/design-a-recipe-app-in-html-css-javascript/)
- [CodeWithFaraz — Recipe Book App](https://www.codewithfaraz.com/content/211/creating-a-recipe-book-app-using-html-css-and-javascript)
- [GitHub — Recipe Website Topic](https://github.com/topics/recipe-website?l=html&o=desc&s=stars)
