---
name: bot-fuzz
description: Run N self-play matches via tools/bot-bench to flush out engine/card bugs that unit tests miss — illegal moves the bot tries to make, deadlocks, unhandled exceptions, runaway games. Use before merging anything that touches the engine runtime, card effects, or move enumeration. This is the behavior-harness fuzz step (Böckeler) and the "bot self-play as a fuzzer" lever from the Phase 4 roadmap.
user-invocable: true
argument-hint: "GAMES=<N> DECK=<bench-deck-id> SEED=<int>"
---

## Inputs

- `GAMES` — number of matches to play (default: 25). For risky engine changes, push to 100+.
- `DECK` — bench deck identifier from `tools/bot-bench/src/runtime.ts` (e.g. `ef-starter`, `seed-aggro`, `gd01-mixed`). Use `all` to sweep.
- `SEED` — PRNG seed for reproducibility. Default: time-based.

## What this catches that unit tests don't

- **Illegal-move attempts**: the bot enumerates legal moves, then plays one. If enumeration disagrees with `validateCommand`, the bot crashes the engine. Unit tests usually don't exercise the full move-enumeration surface.
- **Deadlocks**: `tools/bot-bench/src/runtime.ts` uses the `createDeadlockDetector` exported from the engine. A repeated state fingerprint kills the game and surfaces a real cycle.
- **Slow paths**: a match that runs for thousands of turns is almost certainly a bug — usually a flow transition that fails to advance.
- **Card-effect interactions**: two cards whose effects compose into an unhandled case will throw inside `resolveEffect`. Self-play hits combinations no unit test enumerates.

## Run

```bash
# Single quick sweep (fast)
pnpm --filter @tcg/gundam-bot-bench run bench --games 25

# Full sweep across decks (slower, more coverage)
pnpm --filter @tcg/gundam-bot-bench run bench --games 100 --decks all

# Reproduce a failing seed
pnpm --filter @tcg/gundam-bot-bench run bench --games 1 --seed <int> --deck <id>
```

Adjust flags based on what `tools/bot-bench/scripts/bench.ts` actually accepts — read its `--help` if unsure. The runtime in `tools/bot-bench/src/runtime.ts` is the source of truth for available decks.

## Grading

Score 1–5. Below threshold = FAIL.

| #   | Dimension                      | Threshold | What "5" looks like                                                                                                                                   |
| --- | ------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **All games completed**        | 5         | No unhandled exceptions thrown across all `GAMES` runs. Any throw is a hard failure.                                                                  |
| 2   | **No deadlock detector trips** | 5         | Zero deadlock fingerprints. If the detector fires, find the cycle and fix it; don't tune the detector.                                                |
| 3   | **Bounded game length**        | 4         | Median turns per game in a sane range (deck-dependent; existing baselines in `tools/bot-bench/`). A run that quadruples the baseline is a regression. |
| 4   | **Win-rate sanity**            | 3         | Two equal decks should not produce a 95/5 split. A skew this large usually means a card effect is no-op'ing or game-over conditions are misfiring.    |

## When it fails

The harness produced a reproducer (seed + deck). Now:

1. Re-run with `--games 1 --seed <int>` to confirm reproduction.
2. Add a unit test in `packages/engine/src/runtime/*.test.ts` or the relevant card test that drives the failing state directly — don't rely on bot-bench to keep catching it.
3. Fix the underlying issue.
4. Re-run the full fuzz. Bot-bench passing once is not a guarantee; nondeterminism slipping into match logic would mean it passes 9/10 times.

## When not to use this skill

- For pure UI changes (no engine/card touch). Use `/qa-simulator` instead.
- For trivial card-text edits (typo fixes, no `effects[]` change). The card's own fixture is enough.
- When you need to ship in the next 10 minutes and the change is provably scoped. Document the skip in the PR description.

Bot-fuzz is one of the cheapest computational sensors available for this codebase, but it's not free. Use it deliberately, not reflexively.
