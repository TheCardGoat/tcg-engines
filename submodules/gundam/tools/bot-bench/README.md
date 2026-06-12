# @tcg/gundam-bot-bench

Self-play harness, benchmark CLI, and diff tools for iterating on the Gundam bot's candidate-strategy heuristics.

See `.claude/skills/improve-bot-heuristics.md` for the full playbook. This package supplies the executables the skill drives.

## CLIs

```sh
vp run bench -- \
  --p1 greedy-legal --p2 value-ranked \
  --p1-deck ef-starter --p2-deck seed-aggro \
  --matches 100 \
  --out reports/baseline.json
```

```sh
vp run diff -- \
  --baseline reports/baseline.json \
  --candidate reports/candidate.json \
  --for p1 \
  --out reports/diff.json
```

`bench` runs N self-play matches between two registered strategies + decks and emits a JSON report. The report carries summary stats, per-family attempt/success counts, error-code distributions, and a per-match log keyed by deterministic seed.

`diff` compares two reports and emits a JSON delta plus a one-line verdict. Same seed in both reports = same shuffle, so flipped winners are genuine strategy-driven changes (not variance).

`replay` verifies a saved deterministic replay artifact:

```sh
vp run replay -- --path reports/replay.json
```

`ui-bench` drives the simulator UI with a bot strategy while mirroring the same commands through a headless runtime. It is intended to cover every engine bot candidate family through real UI controls; adding a new engine move should be paired with a ui-bench handler.

```sh
vp run ui-bench -- \
  --base-url http://localhost:3000 \
  --p1 greedy-legal --p2 greedy-legal \
  --max-actions 40
```

For CI or machines that should run the simulator through the same container boundary as production, run the UI bench through the submodule Dockerfile:

```sh
vp run ui-bench:docker -- \
  --p1 greedy-legal --p2 greedy-legal \
  --max-actions 40
```

The Docker runner builds `submodules/gundam/Dockerfile`, starts the static multi-game simulator server in a container, waits for `/gundam/simulator/bot-bench-ui`, then runs the local `ui-bench` command against that server.

## Why `--experimental-transform-types`?

The bench scripts run via `node --experimental-transform-types --no-warnings` (see `package.json#scripts`). Some repo tooling uses `--experimental-strip-types`, which only erases type annotations. The engine's `MatchRuntime` and `GundamPlayerActions` use TypeScript parameter properties (`constructor(protected readonly runtime: MatchRuntime, …)`), and Node's strip-only mode rejects those at parse time. `--experimental-transform-types` actually transforms the syntax, so it accepts parameter properties.

Prefer `vp run bench` / `vp run diff` over invoking node directly — the wrapper passes the right flag.

## Adding a strategy

Add the strategy module to `packages/engine/src/automation/`, re-export from the engine, then register it in `src/strategies.ts`. The skill walks through every step.

## Adding a deck

Add the decklist to `tools/bot-bench/src/decks/`, then add the id to `BenchDeckId` + `REGISTERED_DECKS` in `src/runtime.ts`.

## Reports

`reports/` is gitignored. Commit only the small `diff-*.json` outputs when needed for a PR — full match reports are reproducible from the strategy + deck + seed base.
