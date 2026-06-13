---
tags:
  - factory
  - strategy
  - e2e-test-recipes
date: 2026-06-11
source: factory-archivist
run: run-93866f8f
---

# Strategy: e2e-test-recipes — 2026-06-11 (PDF Export Cycle)

## Mode
Targeted — single backlog item: "Add recipe export to PDF feature"

## Context
- Composite score: 0.44 (passed: false)
- Weakest dimensions: capability_surface (0.0), observability (0.0)
- All 4 prior build phases shipped successfully (H1–H4)
- App is feature-complete for initial scope; this cycle adds PDF export

## Design Space Assessment
| Dimension | Score | Notes |
|---|---|---|
| Features | 4 | Scaffold, MVP, dark mode, ratings all shipped (H1–H4) |
| Bug fixes | 0 | Two open issues (#1 search, #2 mobile images) — no fix experiments run |
| Instrumentation | 0 | Zero logging — observability score 0.0 |
| Flow changes | 0 | No refactors attempted |
| Eval improvements | 1 | Eval harness exists from H1, covers 9 dimensions |
| Knowledge management | 1 | Archive has 7 source notes from prior cycles |

**Underserved:** Bug fixes, Instrumentation, Eval improvements

## Approved Hypothesis

### H1: Add recipe export to PDF via window.print() and CSS print stylesheet
- **Category:** EXPLORE
- **Type:** code
- **Growth dimension:** capability_surface
- **Priority:** high
- **Files:** app.js (export button + handler), styles.css (@media print block), eval/score.py (check_pdf_export)
- **Approach:** Browser-native `window.print()` + CSS `@media print` — the only zero-dependency solution. jsPDF and all external libraries ruled out by factory.md guard.
- **Key techniques:**
  - CSS visibility trick: `body * { visibility: hidden; }` then modal content visible
  - `@page { margin: 20mm 15mm; }` for print margins
  - `break-inside: avoid` on ingredient/instruction lists
  - Black-on-white color override (no CSS custom properties in print)
  - Hide interactive elements (stars, buttons, textarea) in print
  - `document.title` set to recipe name before print for meaningful filename
- **Expected impact:** capability_surface 0.0 → 0.05+, new eval check passes

## Anti-patterns Identified
1. **No jsPDF or external libraries** — factory.md guard forbids dependencies
2. **No `@page { size }` rule** — Chromium-only, degrades in Firefox/Safari
3. **No CSS custom properties in print** — dark mode vars produce unreadable output on paper
4. **Hide export button in print** — or it appears in PDF output
5. **Use visibility, not display:none** — display:none on parent prevents children from showing

## CEO Verdict
**PROCEED** — Plan approved with no issues. Single hypothesis correctly matches targeted mode. Implementation description detailed enough for Builder execution.
