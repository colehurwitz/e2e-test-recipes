---
tags:
  - factory
  - experiment
  - cycle-summary
  - e2e-test-recipes
project: e2e-test-recipes
run_id: run-97d30847
date: 2026-06-13
verdict: BLOCKED
experiments_planned: 3
experiments_run: 1
experiments_kept: 0
experiments_reverted: 1
experiments_skipped: 2
source: factory-archivist
---

# Cycle Summary: e2e-test-recipes — run-97d30847

## Overview

**Cycle type**: Improve
**Run ID**: run-97d30847
**Date**: 2026-06-13
**Outcome**: BLOCKED — all 3 hypotheses failed due to structural threshold ceiling

This cycle attempted 3 hypotheses targeting capability_surface and observability growth dimensions. One experiment was executed and reverted; two were skipped. The root cause is a structural mismatch between the factory eval's 0.8 precheck threshold and the maximum achievable composite score (~0.68) for a zero-dependency project.

## Hypotheses

| # | Hypothesis | Category | Priority | Outcome |
|---|---|---|---|---|
| H1 | Fix XSS + Accessibility Audit | FIX | high | **REVERT** (precheck 0.4635 < 0.8) |
| H2 | Recipe Bookmarking/Favorites | EXPLORE | medium | **SKIPPED** (same threshold) |
| H3 | Structured Logging/Observability | EXPLORE | medium | **SKIPPED** (same threshold) |

## Experiment #6 Detail (H1)

- **What was built**: XSS fix (innerHTML → DOM API with textContent), comprehensive accessibility audit (skip link, keyboard nav, ARIA attributes, focus management, focus-visible outlines)
- **Code quality**: CLEAN — CEO review passed all 6 checklist items, Reviewer verdict PASS
- **Project eval**: 1.0 across 11 dimensions (10 existing + 1 new accessibility)
- **Factory composite**: 0.4635 — below 0.8 threshold
- **PR**: #7 (not merged)
- **Commit**: 9428d5c

## Why Everything Failed

The factory eval composite score is a weighted blend of project eval, hygiene dimensions, and growth metrics. For this project:

- **Project eval**: 1.0 (perfect — all checks pass)
- **Hygiene dimensions** (tests, lint, type_check, coverage): 0.5 each (no tooling detected → neutral score)
- **Growth metrics** (capability_surface, observability): variable but improving
- **Maximum achievable composite**: ~0.68

The 0.8 precheck threshold requires hygiene scores above 0.5, which is impossible without adding test frameworks, linters, or type checkers. The project's `factory.md` guards explicitly forbid adding external dependencies.

**This creates a deadlock**: the factory demands tooling to pass precheck, but the project guards forbid adding tooling.

## Research Findings (Preserved)

This cycle produced valuable research that remains valid for future attempts:

1. **XSS vulnerability** at app.js:316-318 — confirmed real, fix validated
2. **Accessibility gaps** — comprehensive audit with specific remediation plan
3. **Bookmarking pattern** — localStorage multi-key approach, heart icon UX
4. **Observability approach** — zero-dependency structured logging via console wrapper
5. **GitHub #2 analysis** — issue is invalid (srcset doesn't exist; images are CSS gradients)

## Recommendations for Future Cycles

1. **Resolve the threshold deadlock** before running any more Improve cycles on this project
2. **Options**: (a) lower precheck threshold for zero-dependency projects, (b) adjust hygiene scoring for intentional no-tooling stacks, (c) selectively override dependency guard
3. **Do not re-run** the same hypotheses — the research, strategy, and implementation are all sound; only the precheck threshold blocks them
4. **Code from H1 is ready** — commit 9428d5c on branch factory/run-97d30847 contains the XSS fix + accessibility work, reviewed and verified

## Cost Assessment

This cycle consumed research, strategy, build, and review compute for H1, plus research and strategy compute for H2/H3, with zero merged output. Future Improve cycles on this project will incur the same cost with the same zero-merge result until the threshold issue is resolved.

## Archive Inventory (this cycle)

- Experiment note: `experiments/e2e-test-recipes-006.md`
- Strategy snapshot: `strategies/e2e-test-recipes-2026-06-13.md`
- Source notes: 7 new findings in `sources/` (accessibility, bookmarking, observability, XSS, dialog, contrast, srcset)
- Patterns: 3 new entries in `patterns/patterns.md`
- This cycle summary: `experiments/e2e-test-recipes-run-97d30847-cycle-summary.md`
