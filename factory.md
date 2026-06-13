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

### Read-only

- CLAUDE.md

## Guards

- Do not delete or overwrite existing tests
- Do not modify files outside the declared scope
- Do not introduce secrets or credentials into the repository
- Do not add external dependencies (frameworks, build tools, package managers)
- Do not use external APIs for recipe data — keep data hardcoded

## Eval

### Command

```bash
python3 eval/score.py
```

### Threshold

0.8

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
