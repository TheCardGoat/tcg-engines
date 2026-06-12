---
name: replay-debugging
description: Download and inspect a single turn of a real Lorcana game from production using the `tcg-replay` CLI. Use whenever you need to understand what actually happened in a player-reported bug — gives you the cards involved (with file paths), the pre-turn match state, and a step-by-step trace of moves, engine logs, and JSON patches for that turn.
---

# Replay Debugging

This skill owns the workflow of pulling a production Lorcana replay and turning a single turn into a structured trace an LLM agent can reason about. It's the bridge between "player says card X did the wrong thing on turn 7" and a concrete, file-anchored hypothesis you can test.

## When to use this skill

Use this skill when:

- A player bug report references a real game and you have (or can ask for) a `gameId` / replay id and the suspect turn number.
- You're triaging a production issue and need to know which specific card definitions executed in a turn — without spelunking through logs by hand.
- You need the JSON patches and engine logs for a turn so you can reproduce the bug in a test or write a hypothesis about which `runtime-moves` / ability is misbehaving.

Do **not** use this skill for:

- Hypothetical scenarios with no replay id (use [`lorcana-test-generation`](../lorcana-test-generation/SKILL.md) directly).
- Pure rules questions (use [`lorcana-rules`](../lorcana-rules/SKILL.md)).
- Card lookup when you already know the card name (use [`lorcana-find-card`](../lorcana-find-card/SKILL.md)).

This skill is typically the first step of [`triage-player-report`](../../commands/triage-player-report.md) when a replay id is available — it produces the evidence the rest of the triage flow consumes.

## The CLI

Source: [`packages/tools/replay-cli`](../../../packages/tools/replay-cli) (package `@tcg/replay-cli`, bin `tcg-replay`). The CLI has two modes — **trace mode** (default; this skill's primary workflow) and **browser mode** (`--open` / `--fork`, see below) for moving the rest of triage into the UI.

Trace-mode invocation:

```bash
bun packages/tools/replay-cli/src/cli.ts --replay-id <gameId> --turn <n>
```

Flags:

| Flag                 | Required          | Notes                                                                                                                                                                |
| -------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--replay-id <id>`   | yes               | The production game id (the same `gameId` referenced in support tickets / Linear)                                                                                    |
| `--turn <n>`         | yes               | 1-based turn number. `acceptedMove.turnNumber` semantics — turn 1 is the very first player's first move                                                              |
| `--api-origin <url>` | no                | Override the replay download origin. Default: `$TCG_API_ORIGIN` env var, then `https://api.tcg.online`                                                               |
| `--open`             | no (browser mode) | Open the replay watcher in the default browser at the first step of `--turn`, **instead of** printing the trace. See "Browser mode" below.                           |
| `--fork`             | no (browser mode) | Open the "Play from Here" fork view at the first step of `--turn`. Requires `--side`. Implies `--open`. See "Browser mode".                                          |
| `--side <p1\|p2>`    | with `--fork`     | `playerOne` or `playerTwo`. Which player you fork as.                                                                                                                |
| `--base-url <url>`   | no                | Simulator origin for `--open`/`--fork`. Default: `$TCG_REPLAY_BASE_URL` env var, then `http://localhost:5173`. Set to `https://tcg.online` for production replays.   |
| `-h, --help`         | no                | Print usage                                                                                                                                                          |

Exit codes: `0` success · `1` runtime error (replay not found, turn out of range, network) · `2` bad input (missing/invalid flags).

## Browser mode (Play from Here)

`--open` and `--fork` are the bridge from CLI-based triage to in-browser triage. They are **optional** — trace mode remains the default and the right starting point for evidence gathering. Reach for browser mode when the printed trace alone cannot answer the question (see "When the CLI is not enough" in [`triage-player-report`](../../commands/triage-player-report.md), Step 3.5).

Examples:

```bash
# Open the watcher locally at the first step of turn 7
bun packages/tools/replay-cli/src/cli.ts \
  --replay-id <gameId> --turn 7 --open

# Same against production
bun packages/tools/replay-cli/src/cli.ts \
  --replay-id <gameId> --turn 7 --open --base-url https://tcg.online

# Jump straight into a forked, playable session as player 2
bun packages/tools/replay-cli/src/cli.ts \
  --replay-id <gameId> --turn 7 --fork --side playerTwo
```

Behavior in browser mode:

- The CLI converts `--turn N` into the **global step index of the first step of turn N** (the same number trace mode reports as `step <globalIndex>` for that step), then constructs the URL the simulator's replay route already understands:
  - Watcher: `<base-url>/replay/<replayId>?step=<step>`
  - Fork: `<base-url>/replay/<replayId>/fork?step=<step>&side=<side>`
- It prints the URL to stdout (so you can capture it for a Linear comment) and launches the default browser via the OS open command. The trace report is **not** printed in this mode — run a second invocation without `--open` if you need both.
- `--base-url` defaults to local dev (`http://localhost:5173`) so the common case ("triage against my running dev server") is one flag fewer. Switch to production with `--base-url https://tcg.online` or by exporting `TCG_REPLAY_BASE_URL`.

## What you get back

The CLI prints three sections, delimited so you can split the output reliably:

```
=== REPLAY <gameId> · TURN <n> ===
gameType=lorcana matchId=... totalSteps=N totalTurns=M totalMoves=K
players=<p1Id> vs <p2Id>

--- CARDS INVOLVED ---
<defId>  <Card Full Name>  packages/lorcana/lorcana-cards/src/cards/<set>/<type>/<file>.ts
  instances: <inst1>, <inst2>
...

--- INITIAL STATE (before turn <n>) ---
<JSON.stringify of the reconstructed LorcanaMatchState — full pretty-printed>

--- STEPS ---
[step <globalIndex> · turn <n> · actor <actorId>]
move:    <moveId> input=<JSON>
logs:
  <log entry JSON>
  ...
patches:
  <JSON-patch entry>
  ...

[step ...]
```

What "involved" means: any `cardInstanceId` that appears inside the turn's `patches`, `logs`, or `acceptedMove.input` — resolved via `cardsMaps.cardInstances` to the definition id, then to the on-disk file path under `packages/lorcana/lorcana-cards/src/cards/`. Cards merely sitting in the pre-turn state without being touched are intentionally **not** listed (keeps the report focused).

## Workflow (canonical)

1. **Get the replay id and turn.** From a Linear ticket, support thread, or directly from the user. If only the report text is available, ask explicitly.
2. **Run the CLI.** Use `bun packages/tools/replay-cli/src/cli.ts --replay-id <id> --turn <n>` from the repo root. Capture stdout to a file if the output is long — the `--- INITIAL STATE ---` block can be large.
3. **Read `--- CARDS INVOLVED ---` first.** This is your shortlist of files to inspect. Each line gives you the exact path (set / type / number-slug) that you'd otherwise have to derive from a defId by hand.
4. **Open the card files.** For each card on the shortlist, read its definition (`<NNN>-<slug>.ts`) and its test file (`<NNN>-<slug>.test.ts`) before forming a hypothesis. Don't skip the tests — they tell you what the card is _supposed_ to do.
5. **Skim the initial state for relevant zones.** You usually don't need the whole `MatchState`; you need the inkwell counts, the `play` zone for both sides, and the hand of the actor whose move is suspect. Search the JSON for the involved instance ids to locate them.
6. **Walk the steps in order.** For each step:
   - **`move:` line** is the action the player or engine took (id like `play-card`, `quest`, `challenge`, `resolve-effect`, etc.) plus the input.
   - **`logs:`** are engine events emitted while resolving that move. Useful for ability triggers, choices, replacement effects.
   - **`patches:`** are the actual state changes (mutative JSON patch). Each entry has `op`, `path`, and (for adds/replaces) `value`. The `path` tells you which zone or card field changed.
7. **Form a hypothesis.** Tie the bug report to a specific step. Common patterns:
   - Patch missing → the move handler returned early or skipped a branch.
   - Patch present but wrong value → calculation bug (e.g., damage, lore, cost reduction) in a `runtime-moves` resolver or ability handler.
   - Log shows trigger fired but no patches → effect handler ran but produced no state change (often a target-resolution or condition bug).
8. **Hand off to the next skill.** Once you've narrowed the bug to a card or move:
   - For a card-specific bug: switch to [`lorcana-cards`](../lorcana-cards/SKILL.md) with the file path you found.
   - To encode the bug as a failing test: switch to [`lorcana-test-generation`](../lorcana-test-generation/SKILL.md) and feed it the involved cards + the step's move + expected vs. actual.

## Practical tips

- **Replay turns are 1-based.** A turn is one player's whole turn (Start → Main → End), so a single turn can contain many steps — challenges, multiple ink/play moves, ability resolutions, opponent triggers, etc. Always inspect every step in the turn.
- **`acceptedMove.actorId` is a player id.** Cross-reference with the `players=<p1> vs <p2>` line at the top of the output to know whose turn it actually is at any given step. The actor of a step inside turn N may be the opponent if that step is a triggered ability resolution.
- **The CLI is pure-stdout.** Pipe to a file, `less`, or `grep` freely. Example to find the patches that mention a specific instance id:

  ```bash
  bun packages/tools/replay-cli/src/cli.ts --replay-id $ID --turn $N \
    | awk '/^--- STEPS ---/{f=1} f' \
    | grep -E '"path":.*"<instanceId>"' -B 2 -A 1
  ```

- **If the trace looks empty/weird:** Check `totalTurns` in the header. If you asked for a turn beyond it, the CLI exits 1 with a clear "no steps found for turn N" message listing the available turns.
- **If `--- INITIAL STATE ---` looks malformed:** That's the unwrapping error path; capture the full output and report it — the CLI handles five known envelope shapes (v2 server-authority, v2 client-authority, legacy `EngineSnapshot`, very old `engineSnapshot.state`, and a direct `ctx`-bearing root). Anything else throws "did not unwrap to a recognised match-state shape".

## Posting a Linear progress comment

When this skill runs as part of a Linear-tracked triage flow (e.g. `/triage-player-report` was invoked with a Linear issue URL), use the Linear MCP tools to post a single progress comment on the issue summarising what the replay revealed. The agent driving triage should call this after the CLI finishes and _before_ moving on to card validation.

Use this canonical shape so reports are scannable across issues:

```
**Replay evidence**

- Replay: `<gameId>` · turn `<n>` · `<gameType>` · `<p1>` vs `<p2>`
- Cards involved (touched): `<defId> <Card Full Name>` (path: `<file>`); ...
- Suspect step: `step <globalIndex>` (`<moveId>` by `<actorId>`) — `<one-sentence observation>`
- Pre-turn state highlights: `lore <p1>=N <p2>=M`, `inkwell <p1>=A <p2>=B`, `<reported card>` in `<zone>`

_Pulled with `tcg-replay` ([packages/tools/replay-cli](../../../packages/tools/replay-cli))._
```

Rules:

- One comment per replay pull, not one per section. Keep it under ~10 lines so the issue thread stays readable.
- The `Suspect step` observation must point at concrete trace evidence (a missing patch, a wrong patch value, or a log showing a trigger that produced no patches). Don't speculate — if nothing looks anomalous in the printed trace, say so explicitly: _"no obvious anomaly in the printed trace; bug may be in a different turn or in an effect that produced the expected patches."_
- For `Cards involved (touched)`, list the cards from `--- CARDS INVOLVED ---` only. If the player named a card that _isn't_ on the touched list (a passive static modifier sitting in play, for example), note that separately under the `Pre-turn state highlights` line — search the initial state for it and report the zone.
- If the CLI failed (replay not found, turn out of range, network timeout), post a one-line comment saying which failure occurred and that triage will continue without replay evidence. Don't omit the comment — the absence of evidence is itself useful triage context for whoever picks the issue up next.

## What this skill does NOT do

- It does not run patches forward past the requested turn — you only get the pre-turn state and the steps inside the turn. If you need the state at the _end_ of the turn, you'd compute it by applying the printed patches in order to the printed initial state (or just request turn N+1 to get its pre-turn state).
- It does not run the live engine or re-execute moves. Everything is read-only inspection of persisted patches / logs.
- It does not need the simulator, websocket gateway, database, or any auth. Just the production replay endpoint and the local card catalog.

## Reference

- CLI source: [`packages/tools/replay-cli/src/cli.ts`](../../../packages/tools/replay-cli/src/cli.ts)
- Replay payload type: [`packages/lorcana/lorcana-simulator/src/lib/features/replay/fetch-replay.ts`](../../../packages/lorcana/lorcana-simulator/src/lib/features/replay/fetch-replay.ts) (`PersistedReplayData`)
- API endpoint: `GET /v1/games/lorcana/play/replays/:gameId/data` (see [`apps/api/src/modules/play/routes/replay-routes.ts`](../../../apps/api/src/modules/play/routes/replay-routes.ts))
- Card path conventions: [`packages/lorcana/lorcana-cards/src/cards/<set>/<type>/<NNN>-<slug>.ts`](../../../packages/lorcana/lorcana-cards/src/cards/)
