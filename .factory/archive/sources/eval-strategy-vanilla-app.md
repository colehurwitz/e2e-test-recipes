---
tags:
  - factory
  - source
  - e2e-test-recipes
source: factory-archivist
date: 2026-06-11
---

# Evaluation Strategy for Vanilla HTML/CSS/JS App

Research into practical evaluation approaches for a demo recipe app with no build tools.

## Key Findings

- **Functional correctness**: Does the app render recipes? Does dark mode toggle work? Do ratings persist?
- **HTML validation**: W3C validator or html-validate
- **CSS quality**: Stylelint for consistency
- **JavaScript quality**: ESLint with browser globals
- **Accessibility**: Basic a11y checks (contrast, ARIA labels on interactive elements)
- **File existence**: All expected files present and non-empty

## Approach

Since there's no test runner or build system, the eval script should:
1. Check file existence and non-emptiness
2. Run linters (ESLint, Stylelint, html-validate)
3. Optionally use a headless browser (Puppeteer/Playwright) for functional checks
4. For MVP, static analysis is a practical starting point

## Pitfalls

- Over-engineering: Don't treat this as a production app
- External API dependency: Hardcode data to avoid network flakiness
- Missing base app: Backlog assumes a recipe viewer exists — must build it first
- Image handling: Use placeholder SVGs or CSS gradients to avoid external hosting
- localStorage limits: Fine for demo, but verify persistence in tests
