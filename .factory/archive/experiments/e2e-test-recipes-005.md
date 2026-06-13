---
tags:
  - factory
  - experiment
  - e2e-test-recipes
project: e2e-test-recipes
experiment_id: 5
verdict: KEEP
score_delta: "+0.558 (0.442 → 1.000)"
date: 2026-06-11
source: factory-archivist
---

# Experiment #5: Add recipe export to PDF via print stylesheet and window.print()

## Hypothesis
H1 (run-93866f8f) — Add recipe export to PDF using `window.print()` + CSS `@media print` stylesheet. Zero-dependency solution chosen because factory.md guards prohibit adding external libraries (jsPDF/html2pdf ruled out).

## Result
**KEEP** — Score changed from 0.442 to 1.000 (+0.558). New `pdf_export` eval dimension added (10 dimensions total, was 9). Initial score of 0.442 reflected the new eval dimension failing before implementation; final 1.000 confirms all 11 sub-checks pass. CEO code review: **CLEAN** — no issues found across all 7 checklist items (correctness, security, edge cases, missing tests, style, scope, guardrails).

## What Changed

### Files Modified (3 files, +179 / -9 lines)
| File | Changes | Purpose |
|---|---|---|
| app.js | +14 lines | Export PDF button in modal, `window.print()` handler, `document.title` swap with `afterprint` restore |
| styles.css | +104 lines | `@media print` block: visibility trick, modal repositioning, hide interactive elements, high-contrast overrides, `@page` margins, `break-inside: avoid`, print typography |
| eval/score.py | +70 / -9 lines | New `check_pdf_export()` with 11 verification points; eval weight redistribution (added 0.10 for pdf_export, reduced others proportionally, total still 1.0) |

### Implementation Details
- **Export button**: `🖨️ Export PDF` button added inside recipe detail modal, styled with existing CSS custom properties
- **Print handler**: Sets `document.title` to recipe name (for meaningful PDF filename), calls `window.print()`, restores title via one-shot `afterprint` event listener (self-removing to prevent memory leaks)
- **CSS print rules**: Uses `visibility: hidden` / `visible` pattern to isolate modal content; positions modal at `absolute; left:0; top:0` for page origin; hides rating UI, close/export buttons, review textarea; overrides to `#000` on `#fff` regardless of dark/light theme; `@page { margin: 20mm 15mm }`; `break-inside: avoid` on ingredient/instruction lists; `font-size: 12pt; line-height: 1.6`
- **Eval coverage**: 11 sub-checks across CSS print rules, JS export functionality, and title swap behavior

### Code Review Highlights (CEO Verdict: CLEAN)
- Correctness: PASS — Visibility trick correctly implemented, `afterprint` self-removing listener prevents leaks
- Security: PASS — No injection vectors, `window.print()` is safe browser API
- Edge cases: PASS — Export button existence checked defensively, works in both light/dark themes
- Scope: PASS — Only 3 files touched, all within declared scope

## PR
- **PR #5**: "Add recipe export to PDF via print stylesheet" (branch: `factory/run-93866f8f`)
- State: OPEN (pending merge)
- Commit: `f39e85b`

## Links
- Project: e2e-test-recipes
- Issue: #4
- PR: #5
- Run: run-93866f8f
