# Factory Configuration

## Goal

A self-contained recipe viewer web app with search, filtering, dark mode, and 5-star ratings — built with vanilla HTML/CSS/JS for e2e test demonstration.

## Scope

### Modifiable

- index.html
- styles.css
- app.js
- eval/score.py
- factory.md
- package.json
- eslint.config.mjs
- jsconfig.json
- tests/

### Read-only

- CLAUDE.md

## Guards

- Do not delete or overwrite existing tests
- Do not modify files outside the declared scope
- Do not introduce secrets or credentials into the repository
- Do not add external runtime dependencies — dev-only tooling (test runners, linters, type checkers) is permitted and does not affect the vanilla runtime
- Do not use external APIs for recipe data — keep data hardcoded

## Eval

### Command

```bash
python3 eval/score.py
```

### Threshold

0.8

## Eval Weights

hygiene: 0.35, growth: 0.35, project: 0.30

## Project Eval

file_existence, html_structure, css_custom_properties, js_recipe_data, search_feature, category_filter, detail_view, dark_mode, rating_system, pdf_export

## Target Branch

main

## Smoke Test

```bash
python3 -c "import http.server,socketserver,threading,urllib.request; s=socketserver.TCPServer(('',8766),http.server.SimpleHTTPRequestHandler); t=threading.Thread(target=s.serve_forever,daemon=True); t.start(); r=urllib.request.urlopen('http://localhost:8766/'); assert r.status==200; assert b'Recipe Viewer' in r.read(); s.shutdown(); print('E2E OK')"
```

## Constraints

- Prefer small, incremental changes over large rewrites
- Keep the app vanilla HTML/CSS/JS — no frameworks or build tools
- All colors must use CSS custom properties for dark mode compatibility
- Recipe data must be self-contained (hardcoded, no external APIs)
