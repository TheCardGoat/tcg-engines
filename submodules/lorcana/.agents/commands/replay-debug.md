---
name: replay-debug
description: Download a Lorcana replay turn from production and produce a structured debugging report — cards involved, pre-turn state, and the per-step trace of moves, engine logs, and JSON patches.
user_invokable: true
---

# Replay Debug Command

Your task is to download and analyze a single turn of a real Lorcana game, then produce a structured debugging report. The arguments **$ARGUMENTS** must include a replay id and a turn number; if either is missing, ask for it before doing anything else.

Argument format (any of these is acceptable):

- `<replayId> <turn>` — positional
- `--replay-id <id> --turn <n>` — flagged
- A free-form sentence containing the id and turn — extract them and confirm before running

If the user provides a Linear ticket URL or support thread instead, open it first to extract the replay id and turn. Do not guess either value.

---

## Skills You Must Use

This command is skill-orchestrated. Use these skills directly:

- [replay-debugging](.agents/skills/replay-debugging/SKILL.md) — owns the CLI invocation, output parsing, and trace interpretation. This is the primary skill; everything below is its workflow.
- [lorcana-find-card](.agents/skills/lorcana-find-card/SKILL.md) — only if the printed `CARDS INVOLVED` block fails to resolve a defId to a file path (rare; surface as a warning).
- [lorcana-rules](.agents/skills/lorcana-rules/SKILL.md) — for any rules question that surfaces while interpreting the steps.

If the user's intent extends past "produce a report" into "fix the bug", do not implement the fix here. Hand off to [`triage-player-report`](./triage-player-report.md) with the report you produced as input.

---

## Step 1 — Validate inputs

1. Parse `$ARGUMENTS` into a `replayId` (string) and `turn` (positive integer).
2. If `turn` is missing, zero, or negative, stop and ask the user.
3. If `replayId` looks suspicious (empty, contains spaces, longer than 200 chars), stop and ask the user.
4. Print back what you understood: `Running replay-debug for replayId=<...>, turn=<n>` so the user can correct you.

## Step 2 — Run the CLI

From the repo root:

```bash
bun packages/tools/replay-cli/src/cli.ts --replay-id <replayId> --turn <turn>
```

Capture both stdout and stderr. Allow up to 60 seconds for the network fetch.

If the CLI exits non-zero:

- Exit code `2` (bad input): re-validate Step 1 and try again. Do not retry without user input if the message is genuinely about your args.
- Exit code `1`, message contains `replay not found`: tell the user the replay id is unknown to the API. Stop.
- Exit code `1`, message contains `No steps found for turn`: tell the user which turns _are_ available (the message lists them). Ask which one they want, or stop.
- Any other exit `1`: surface the stderr verbatim and stop.

## Step 3 — Parse the output

The CLI's stdout has three section markers, each on its own line:

```
--- CARDS INVOLVED ---
--- INITIAL STATE (before turn N) ---
--- STEPS ---
```

Split the output at those markers. You'll need each section.

## Step 4 — Produce the report

Write a structured summary directly to the user. Do **not** dump the raw CLI output verbatim — it's too long. Structure your reply as:

### Header

One line: `Replay <gameId> · Turn <n> · <gameType> · <p1> vs <p2>`. Pulled from the CLI header.

### Cards involved

A bullet list, one bullet per distinct definition, in the order the CLI printed them:

- `[<CardFullName>](<file path>)` — `<defId>` · instances: `<inst1>, <inst2>`

The file path links must be markdown links so the user can click through. Use the relative path the CLI prints — it's already correct.

### Step-by-step trace

For each step in the `--- STEPS ---` section, render a compact block:

> **Step `<globalIndex>` · actor `<actorId>`**
> `move`: `<moveId>` · `input`: `<inline JSON, truncate strings >120 chars>`
> `logs`: <one-line summary if ≤3 entries; otherwise count + indent the first 3 then `...`>
> `patches`: <count + bulleted list of `<op> <path> <truncated value>`>

Inline raw JSON only when it's short. For long arrays / values, summarise (e.g., `12 patches mutating play[1] and bag[*]`).

### Pre-turn state highlights

Do **not** print the full initial state. Instead, extract just:

- The `lore` for each player (search `state.lore` or `players.*.lore`).
- The `inkwell` count for each player (length of `inkwell` arrays or `availableInk` if present).
- For each instance id in the "Cards involved" list: which zone it's in at turn start (search the JSON for that id and report the zone path that contains it). If an id isn't found, say so — it likely entered play during this turn.

### Hypothesis

End with a short ("3–6 sentences") hypothesis section. Tie at least one observation in the trace to at least one card on the involved list. Use phrases like "patch at step X is missing", "log indicates trigger Y fired but no subsequent patch", or "input names instance Z which is in zone W". Do **not** speculate beyond what the data supports — if nothing looks anomalous, say "no obvious anomaly in the printed trace; the bug may be in a turn other than the one inspected, or it may be in an effect that executed but produced the expected patches".

## Step 5 — Offer next steps

After the report, offer two follow-ups (one line each):

1. _"Run again for turn N±1?"_ — useful if the suspect behavior straddles the turn boundary.
2. _"Hand off to `/triage-player-report` to encode this as a failing test?"_ — useful when the user wants a fix, not just a diagnosis.

Wait for the user's choice. Do not chain into another command without confirmation.

---

## Examples

User: `/replay-debug abc123 7`

Output (abbreviated): the report described in Step 4, followed by the two questions in Step 5.

User: `/replay-debug from this Linear ticket: https://linear.app/.../ABC-456`

Action: open the ticket via the Linear MCP, extract `replayId` and `turn` from the description, confirm with the user, then proceed at Step 2.

User: `/replay-debug abc123 0`

Action: stop, explain that `--turn` is 1-based (the CLI rejects 0), ask which turn they meant.

---

## Boundaries

- Do not modify any files while running this command. It is a read-only investigation.
- Do not invoke the CLI more than three times per session without an explicit ask — replays can be large. If the user wants several turns, batch the requests in one message.
- Do not paraphrase the JSON patches — patches are evidence; preserve `op` and `path` exactly when quoting them.
- Do not implement fixes here. The hand-off target for fixes is [`triage-player-report`](./triage-player-report.md).
