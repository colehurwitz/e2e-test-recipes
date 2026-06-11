---
name: factory
description: Dispatch and manage Factory CEO runs in the board agent's nested tmux. Trigger on "run factory", "factory improve", "factory build", "dispatch factory", or /factory.
user-invocable: true
allowed-tools:
  - Read
  - Bash(cat *)
  - Bash(tmux *)
  - Bash(mkdir *)
  - Bash(rm -f *)
  - Bash(sleep *)
  - Bash(factory *)
  - Agent
---

# /factory — Factory CEO Dispatch & Lifecycle

Dispatch Factory CLI runs (autonomous build/improve cycles) into the board agent's nested tmux
session. Factory runs are long-lived — they spawn specialist agents (Researcher, Strategist,
Builder, Reviewer, Evaluator, Archivist) orchestrated by a CEO agent. This skill manages the
full lifecycle: dispatch, monitor, message, and recall.

## Arguments

```
/factory <project-path> [flags]                  — new CEO run
/factory <name> --check                          — peek at a running run's status
/factory <name> --continue "message"             — send a follow-up instruction
/factory <name> --recall                         — stop and clean up the run
/factory --list                                  — list running factory windows
```

## Flags (new dispatch only)

- `--mode <mode>` — Factory mode: `auto` (default), `interactive`, `research`, `meta`, `build`, `discover`, `improve`
- `--focus "item"` — Target a specific backlog item, issue number, or `owner/repo#N`
- `--loop` — Continuous improvement loop (keeps running cycles)
- `--model <model>` — Override model for specialist agents
- `--headless` — Run non-interactively (only if explicitly requested)
- `--no-monitor` — Skip signal-file monitoring setup
- `--monitor cron <minutes>` — Check back after N minutes instead of signal polling

## Configuration

Read `<workspace-root>/.claude/factory/config.yaml` if it exists. Supported fields:

```yaml
approval:
  style: verbal       # 'verbal' (ask in chat/Slack, default) | 'ui' (TUI permission prompt)
  new_dispatch: required  # 'required' (default) | 'optional' | 'never'
```

When `approval.style` is `verbal` (the default), ask for confirmation via your normal reply
channel (Slack, chat, etc.) instead of using `AskUserQuestion`. Use `ui` only when the user
interacts directly via the terminal.

When `approval.new_dispatch` is `never`, skip approval entirely for new dispatches.

## Steps

### 0. Resolve tmux config (do this first, for every operation)

The board agent's nested tmux lives at a well-known location relative to the workspace root.
Resolve these values:

```bash
WORKSPACE_ROOT="$(git -C "$(pwd)" rev-parse --show-toplevel 2>/dev/null || pwd)"
SOCKET="${WORKSPACE_ROOT}/.sock.tmux"
SESSION="factories"
SIGNALS="${WORKSPACE_ROOT}/signals"
```

Verify the socket exists:
```bash
tmux -S "$SOCKET" list-sessions
```
Error clearly if the socket is missing — the nested tmux server must be running.

---

### New dispatch

1. **Resolve the project directory.**

   Derive a short slug from the request (e.g. "Build a calculator" → `calculator`,
   `/path/to/myapp` → `myapp`). Then check whether a project directory already exists:

   ```bash
   PROJECTS_DIR="${HOME}/factory-projects"
   SLUG="<derived-slug>"
   PROJECT_PATH="${PROJECTS_DIR}/${SLUG}"
   ```

   - **Directory exists** (`[ -d "$PROJECT_PATH" ]`): reuse it. This is a returning project —
     factory will detect its state (`has_factory` → improve, `no_factory` → discover, etc.).
     Pass the absolute path to `factory ceo`.
   - **Directory does not exist**: this is a new project. Pass the idea string to `factory ceo`
     with `--dir <slug>`. Factory will create `${PROJECTS_DIR}/${SLUG}/` and scaffold it.

   If the user provided an explicit filesystem path (not under `~/factory-projects/`), use that
   path directly instead of deriving from `PROJECTS_DIR`.

2. **Derive window name.**

   Use the slug as the tmux window name. Sanitize: non-alphanumeric → `-`, lowercase.

   Check no window with that name already exists in the session — if it does, error with
   suggestion to `--check` or `--recall` the existing one.

3. **Build the factory command.**

   - **Existing project** (directory exists or explicit path):
     ```
     factory ceo <absolute-project-path> [--mode <mode>] [--focus "item"] [--loop] [--model <model>]
     ```
   - **New project from idea** (directory does not exist):
     ```
     factory ceo "<idea string>" --dir <slug> [--mode <mode>] [--model <model>]
     ```
     The `--dir` flag is REQUIRED for new projects — without it, factory may use an
     auto-generated name that doesn't match the window name.

   Do NOT add `--headless` by default — the CEO runs interactively in its tmux window.
   Only add `--headless` if the user explicitly requests it.

4. **Prepare signal file instruction.** Ensure the signals directory exists:
   ```bash
   mkdir -p "$SIGNALS"
   ```
   The CEO agent writes its own completion artifacts to `.factory/`, but for the board agent's
   monitoring we use a signal file convention. Append a signal-file instruction to the factory
   command via environment variable or by wrapping the command:
   ```bash
   factory ceo <path-or-idea> [flags] && echo "completed $(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$SIGNALS/<name>.done" || echo "failed $(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$SIGNALS/<name>.done"
   ```

5. **Get approval** if `approval.new_dispatch` is `required` (default). The mechanism depends
   on `approval.style`:
   - `ui` (default): use `AskUserQuestion` to trigger the Claude Code permission prompt.
   - `verbal`: ask in the chat/Slack channel ("Dispatch factory run `<name>` via `factory ceo
     <path> [flags]`? Monitoring: signal poll + health check.") and wait for conversational
     yes/no before proceeding.
   Show: window name, project path, full factory command, monitoring strategy.

6. **Create tmux window:**
   - **Existing project:** use the project path as cwd:
     ```bash
     tmux -S "$SOCKET" new-window -t "$SESSION" -n <name> -c <absolute-project-path>
     ```
   - **New project:** use `~/factory-projects` as cwd (factory creates the subdirectory via
     `--dir`). Never use the board agent's workspace root:
     ```bash
     tmux -S "$SOCKET" new-window -t "$SESSION" -n <name> -c ~/factory-projects
     ```

7. **Launch the factory run:**
   ```bash
   tmux -S "$SOCKET" send-keys -t "${SESSION}:<name>" '<full-command-with-signal>' Enter
   ```

8. **Set up monitoring** per `--monitor` (default: `signal`):
   - `signal` — background poll watching `$SIGNALS/<name>.done` every 5 seconds, timeout at
     30 minutes. Use a background loop or scheduled check.
   - `cron <N>` — schedule a check-back after N minutes.
   - `--no-monitor` — skip.

9. **Health check.** Schedule a one-shot check at 10 minutes using a haiku subagent to peek
   at the tmux pane:
   ```bash
   tmux -S "$SOCKET" capture-pane -t "${SESSION}:<name>" -p -S -10
   ```
   Report: is the CEO actively working, stuck on a prompt, idle, or done?

10. **Report:** "Factory run `<name>` dispatched. Monitoring: signal poll + 10 min health check."

---

### Check status (`--check`)

Use a haiku subagent to capture the last 10 lines of the tmux pane — protects the board agent's
context window from raw terminal output:

```bash
tmux -S "$SOCKET" capture-pane -t "${SESSION}:<name>" -p -S -10
```

Also check factory's own status if the project has `.factory/`:
```bash
factory status <project-path>
```

Report concisely: actively working, stuck on a prompt, idle, or done.

---

### Continue (`--continue`)

Send a follow-up instruction to a running CEO:

1. Verify the window exists:
   ```bash
   tmux -S "$SOCKET" list-windows -t "$SESSION" | grep <name>
   ```
2. Send the message via tmux send-keys. Handle vi mode — send `Escape` then `i` before the
   message. For long messages, `sleep 0.5` before the final Enter:
   ```bash
   tmux -S "$SOCKET" send-keys -t "${SESSION}:<name>" Escape i "<message>" && sleep 0.5
   tmux -S "$SOCKET" send-keys -t "${SESSION}:<name>" Enter
   ```
3. Wait 2s, verify the pane accepted the message.

---

### Recall (`--recall`)

1. Send `/exit` + Enter to the CEO:
   ```bash
   tmux -S "$SOCKET" send-keys -t "${SESSION}:<name>" "/exit" Enter
   ```
2. Wait 3 seconds.
3. Kill the window:
   ```bash
   tmux -S "$SOCKET" kill-window -t "${SESSION}:<name>"
   ```
4. Clean up signal files:
   ```bash
   rm -f "$SIGNALS/<name>.done"
   ```

---

### List running (`--list`)

```bash
tmux -S "$SOCKET" list-windows -t "$SESSION" -F '#I: #W (#{pane_current_command})'
```

Optionally cross-reference with `factory tmux-ls` for factory-managed sessions.

---

## Factory CLI Quick Reference

These commands can be run directly (not via dispatch) for inspection:

| Command | Purpose |
|---------|---------|
| `factory detect <path>` | Detect project state |
| `factory discover <path>` | Introspect project, generate eval profile |
| `factory study <path>` | Deep analysis via Researcher agent |
| `factory eval <path>` | Run evals, print composite score |
| `factory status <path>` | Project status (state, scores, backlog) |
| `factory history <path>` | Experiment history table |
| `factory diff <path> --exp1 N --exp2 M` | Compare two experiments |
| `factory explain <path> --exp N` | FEEC analysis of an experiment |
| `factory backlog-list <path>` | List pending backlog items |
| `factory backlog-add <path> "item"` | Add backlog item |
| `factory backlog-remove <path> "item"` | Remove backlog item |
| `factory usage <path>` | Per-agent token usage breakdown |
| `factory registry-list` | List all factory-managed projects |
| `factory agent <role> --task "..." --project <path>` | Invoke a specialist directly |

## Key Concepts

- **Experiment:** Every code change is a tracked experiment with hypothesis, before/after eval scores, diff, and keep/revert verdict
- **FEEC Priority:** Fix > Exploit > Explore > Combine — how the Strategist ranks hypotheses
- **Guards:** Inviolable rules defined in `factory.md` (the project config, not this skill) — violations force revert
- **`.factory/`:** Per-project state directory containing experiments, strategy, archive, and config
- **`factory.md`:** Per-project config file (at project root) defining goal, scope, guards, eval commands, and thresholds

## Important

- **Always dispatch into the nested tmux** (`factories` session via `.sock.tmux`), never into the board agent's own pane.
- The nested tmux socket is at `<workspace-root>/.sock.tmux` — verify it exists before any tmux operation.
- Get explicit approval before dispatching NEW factory runs.
- `--check`, `--continue`, and `--recall` on existing runs do not need approval.
- Do NOT use `--headless` by default — the CEO runs interactively in its own tmux window.
- Use `--continue` to send follow-up instructions or respond to CEO questions.
- **Always reply in the originating thread.** When this skill is triggered by a `<message>` with
  a `thread` attribute, ALL replies (approval requests, status updates, completion reports) MUST
  use that thread's `thread_ts`. When there is no thread attribute, use the message's own
  `timestamp`/`message_id` as `thread_ts` to start a thread under the triggering message. Never
  post factory updates to the channel top-level.
