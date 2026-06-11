# SOP Compact — Context Preservation

This file configures the sop-compact procedure for context preservation across compaction events.

## Pre-Compact Procedure

Before compaction, save a handoff snapshot to `.claude/sop-compact/`:

1. Summarize current task state and progress
2. List active files and their modification status
3. Note any pending decisions or blockers
4. Record the current working context

## Session Start Procedure

On session start, check for handoff files in `.claude/sop-compact/`:

1. Read the most recent `handoff-*.md` file
2. Restore context from the handoff
3. Resume work from where it left off

## Handoff Format

Handoff files are stored at `.claude/sop-compact/handoff-{timestamp}.md` with:
- Task summary
- Current state
- Next steps
- Key context that must survive compaction
