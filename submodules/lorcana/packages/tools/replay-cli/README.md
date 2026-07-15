# `@tcg/replay-cli` (`tcg-replay`)

Download a Lorcana replay from production (or any compatible API origin) and
either:

1. **Trace mode (default)** — print the per-turn debug trace (cards involved,
   pre-turn match state, pending player selections, per-step move + logs +
   JSON patches) so an LLM agent or human can reason about a specific turn
   from a player bug report.
2. **Browser mode** — open the simulator's replay watcher (or "play from
   here" fork view) in the default browser at the exact step of the
   requested turn, so the rest of triage can happen in the UI.

The two modes are mutually exclusive on a single invocation. Use trace mode
for evidence/quoting; switch to browser mode the moment you need to
**validate the bug visually from both sides of the table**, which the trace
cannot show on its own (positional info, hidden zones, UI affordances, what
the opponent saw).

## Install / run

The package is workspace-private; run it directly from the repo root:

```bash
# Trace mode — prints the report
bun packages/tools/replay-cli/src/cli.ts --replay-id <gameId> --turn <n>

# Browser mode — opens the replay watcher locally
bun packages/tools/replay-cli/src/cli.ts \
  --replay-id <gameId> --turn <n> --open

# Browser mode — production simulator
bun packages/tools/replay-cli/src/cli.ts \
  --replay-id <gameId> --turn <n> --open \
  --base-url https://tcg.online

# Browser mode — jump straight into a forked, playable session
bun packages/tools/replay-cli/src/cli.ts \
  --replay-id <gameId> --turn <n> --fork --side playerTwo
```

Run `bun packages/tools/replay-cli/src/cli.ts --help` for the full list of
flags.

## Flags

| Flag                 | Mode           | Notes                                                                                              |
| -------------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| `--replay-id <id>`   | both           | Required. Production `gameId` from the support ticket / Linear issue.                              |
| `--turn <n>`         | both           | Required. 1-based turn number (`acceptedMove.turnNumber` semantics).                               |
| `--api-origin <url>` | trace          | Override the replay download origin. Default: `$TCG_API_ORIGIN` env, then `https://api.tcg.online`.|
| `--open`             | browser        | Open the replay watcher at the first step of `--turn` instead of printing the trace.               |
| `--fork`             | browser        | Open the "Play from Here" fork view at the first step of `--turn`. Requires `--side`. Implies `--open`. |
| `--side <p1\|p2>`    | browser (fork) | Required with `--fork`. Accepts `playerOne` or `playerTwo`.                                        |
| `--base-url <url>`   | browser        | Simulator origin for the opened URL. Default: `$TCG_REPLAY_BASE_URL` env, then `http://localhost:5173`. Set to `https://tcg.online` for production. |
| `-h`, `--help`       | —              | Print usage and exit.                                                                              |

Exit codes: `0` success · `1` runtime error (replay not found, turn out of
range, fetch failure) · `2` bad input (missing/invalid flag).

## Browser-mode URL shape

The opened URL is constructed from `--base-url`, the replay id, and the
**first step** of the requested turn (resolved by `extractTurn` so it
matches what trace mode would call step 0 of that turn):

- Watcher: `<base-url>/replay/<replayId>?step=<step>`
- Fork: `<base-url>/replay/<replayId>/fork?step=<step>&side=<side>`

The simulator's replay route reads `?step=` on load and seeks to that step,
so the deep-link works whether you target a local dev server or production.

## When to use which mode

Use **trace mode** when you need:

- A quotable, file-anchored summary of cards involved + the per-step JSON
  patches (e.g. for a Linear progress comment or an LLM hypothesis prompt).
- Evidence to encode the bug as a failing test (`lorcana-test-generation`).

Use **browser mode** when the trace is **not sufficient on its own**:

- The bug is positional / UI-layer (drag target, hover state, tooltip).
- The reported behavior depends on what the **opponent** saw — their hand
  contents, their visible zones, available targets from their perspective.
- The bug is about hidden information or animation timing.
- You need to click through subsequent steps interactively to confirm the
  bug reproduces deterministically.

In practice, triage often uses **both**: trace mode to ground the hypothesis,
then `--open` to verify the moment in the UI and check the opponent's side.

## See also

- Skill: [`.agents/skills/replay-debugging`](../../../.agents/skills/replay-debugging/SKILL.md)
- Command: [`.agents/commands/replay-debug.md`](../../../.agents/commands/replay-debug.md)
- Triage flow: [`.claude/commands/triage-player-report.md`](../../../.claude/commands/triage-player-report.md)
