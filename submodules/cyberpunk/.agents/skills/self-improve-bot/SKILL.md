---
name: self-improve-bot
description: End-to-end test of the AI self-improvement mechanism. Runs the GreedyWeights hill-climber via `ai-runner train`, verifies whether the trained weights actually beat the default baseline out-of-sample (they sometimes don't — see Step 4), and (optionally) wires the winning weights into the simulator. Use whenever you change anything in `packages/engine/src/automation/strategies/greedy.ts`, `tools/ai-runner/src/train.ts`, the bot's heuristics, or want to demonstrate the self-improving loop on a fresh deck pool.
user-invocable: true
argument-hint: "[OPPONENT=greedy] [MATCHES=20] [ITERATIONS=40] [REAL_CARDS=false]"
---

## MANDATORY PREPARATION

Before any substantive work, run `./.agents/skills/cyberpunk-tcg-rules` and keep its glossary in context. Then load:

- `packages/engine/src/automation/README.md` — the bot architecture this skill exercises.
- `packages/engine/src/automation/strategies/greedy.ts` — the parameterized strategy the trainer searches.
- `tools/ai-runner/src/train.ts` — the hill-climber.
- `tools/ai-runner/src/cli.ts` — the `train` subcommand surface.

Sample print-n-play decks live at `packages/cards/src/decks/` (`arasaka-print-n-play-deck.ts`, `merc-print-n-play-deck.ts`). They are not yet wired into `tools/ai-runner` — the runner uses a synthetic deck builder in `tools/ai-runner/src/real-catalog.ts`. Use the decks as the canonical reference for what "real" matchups look like when extending coverage; flag explicitly if a request needs them and they are still not wired up.

## What "self-improving" means here

The trainer iterates this loop:

1. Mutate `GreedyWeights` (one scalar ±1 OR one priority-map swap).
2. Play `MATCHES` games between candidate-greedy and the baseline OPPONENT with the same fixed seed batch for every candidate.
3. Accept the candidate only if its win-rate **strictly improves** the best so far.
4. After `ITERATIONS`, write the best weights to `--output` as JSON.

The signal is win-rate. Determinism comes from the seed prefix; noise comes from the mutation RNG. If baseline win-rate is already ≥ 95% (e.g. vs `random`), the loop has no headroom — pick a stronger opponent.

Observed baselines on the test-catalog fixture (DEFAULT_GREEDY_WEIGHTS in the `p1` seat, small samples — use as ballpark only):

| Opponent               | Greedy baseline win-rate        | Useful for training?                                                                                         |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `random`               | ~100%                           | No (saturated)                                                                                               |
| `first-legal`          | ~30–50%                         | Yes (huge headroom)                                                                                          |
| `greedy` (mirror)      | ~50–65%                         | Yes (modest signal)                                                                                          |
| `monte-carlo`          | varies                          | Yes                                                                                                          |
| `monte-carlo-greedy`   | varies                          | Yes                                                                                                          |
| `mcts` / `mcts-greedy` | often ~100% at default rollouts | No — greedy already dominates the default MCTS budget; raise rollouts in the engine or pick another opponent |

## Arguments

| Name         | Default  | Meaning                                                                                                                                                                                                                                                                                                                                                              |
| ------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPPONENT`   | `greedy` | Baseline strategy. One of: `random`, `first-legal`, `greedy`, `monte-carlo`, `monte-carlo-greedy`, `mcts`, `mcts-greedy`.                                                                                                                                                                                                                                            |
| `MATCHES`    | `20`     | Matches per candidate evaluation. Higher = lower noise, slower.                                                                                                                                                                                                                                                                                                      |
| `ITERATIONS` | `40`     | Total candidate evaluations.                                                                                                                                                                                                                                                                                                                                         |
| `REAL_CARDS` | `false`  | If `true`, pass `--real-cards`: evaluation uses the real `@tcg/cyberpunk-cards` catalog. Note: both players play the **same** deterministic synthetic 40-card deck (see `tools/ai-runner/src/real-catalog.ts`) — this exercises real card text, but it does _not_ simulate asymmetric Arasaka-vs-Merc matchups. Perf is comparable to the test fixture (~5 ms/game). |

## Step 1 — Pre-flight

Run these in parallel and confirm clean before proceeding:

```
vp test packages/engine/tests/automation/ tools/ai-runner/tests/
vp check
```

If either fails on an automation or trainer file, fix before training — a flaky/illegal-move bot will produce garbage win-rates. Pre-existing warnings in unrelated files (e.g. `apps/simulator/src/engine/practice/importedDeck.ts`) are fine.

Known `vp check` false positives you can ignore while running this skill:

- `tools/ai-runner/trained/*.json` — newly written weight files are valid JSON but may fail oxfmt's preferred formatting. The trainer writes them with `JSON.stringify(..., null, 2)`; do not auto-fix in place if the file is a freshly trained artifact you might commit verbatim.
- `packages/cards/src/decks/{arasaka,merc}-print-n-play-deck.ts` — print-n-play decks carry historical formatting; do not reformat them as part of this skill.
- This `SKILL.md` itself may report formatting drift after edits; run `vp check --fix .agents/skills/self-improve-bot/SKILL.md` if you want it clean before committing.

## Step 2 — Run the trainer

Use a stable timestamped output path so runs are comparable:

```
export TS=$(date +%s)        # exported so Step 4 in the same shell can reuse it
node --experimental-transform-types tools/ai-runner/src/cli.ts train \
  --opponent <OPPONENT> \
  --matches <MATCHES> \
  --iterations <ITERATIONS> \
  --seed self-improve-$TS \
  --output tools/ai-runner/trained/weights-$TS.json \
  [--real-cards]
```

`export` keeps `$TS` alive for the verification snippet in Step 4. If you open a new shell between steps, re-set `TS` to the same value before running the verify block.

Capture the full stdout. The last two lines are the verdict:

```
Training complete: baseline X.X% → best Y.Y% (Δ Z.Zpp)
Accepted N / ITERATIONS mutations.
```

## Step 3 — Verify improvement

Confirm all of:

- `best ≥ baseline` (the hill-climber's invariant — anything else is a bug).
- `Δ > 0` when `OPPONENT != random` and `baseline < 90%`. If Δ is 0 and baseline had headroom, the noise budget was too tight: re-run with double `MATCHES`.
- No `illegal` or `stuck` reasons during training. Run `node --experimental-transform-types tools/ai-runner/src/cli.ts --strategy-a greedy --strategy-b <OPPONENT> --matches <MATCHES> --seed verify --max-steps 500 --verbose` with the same opponent; if any illegals show, file them before trusting the trained weights. (`--max-steps 500` caps each match so a buggy strategy can't hang the run.)
- The output JSON exists at `tools/ai-runner/trained/weights-$TS.json` and contains `bestWeights` matching the on-disk schema in `GreedyWeights`.

## Step 4 — Confirm the trained weights actually win

Plug the trained weights back into greedy and play a fresh, **out-of-sample** batch against the same opponent (different seed) to rule out overfitting to the training seeds.

Important shell footgun: `TS=value node -e "...weights-$TS.json..."` does **not** work — bash performs `$TS` expansion before applying the inline assignment, so the path resolves to `weights-.json`. Always `export TS=...` (or assign on a separate line) before invoking `node -e`.

```
export TS=<the timestamp from Step 2>
node --experimental-transform-types -e "
import('./packages/engine/dist/index.mjs').then(async ({ createGreedyStrategy, firstLegalStrategy, greedyStrategy, mctsGreedyStrategy, mctsStrategy, monteCarloGreedyStrategy, monteCarloStrategy, randomStrategy, runAutoMatch }) => {
  const { readFileSync } = await import('node:fs');
  const { bestWeights } = JSON.parse(readFileSync('tools/ai-runner/trained/weights-$TS.json', 'utf8'));
  const trained = createGreedyStrategy(bestWeights, 'greedy-trained');
  const opponents = { 'first-legal': firstLegalStrategy, random: randomStrategy, greedy: greedyStrategy, 'monte-carlo': monteCarloStrategy, 'monte-carlo-greedy': monteCarloGreedyStrategy, mcts: mctsStrategy, 'mcts-greedy': mctsGreedyStrategy };
  const opp = opponents['<OPPONENT>'];
  if (!opp) throw new Error('Unknown opponent: <OPPONENT>');
  const { createTestCatalog, createTestDecks, createTestPlayers } = await import('./tools/ai-runner/src/test-catalog.ts');
  let trainedWins = 0, defaultWins = 0;
  for (let i = 0; i < 50; i++) {
    const seed = 'verify/' + i;
    const a = runAutoMatch({ players: createTestPlayers(), decks: createTestDecks(), strategies: [trained, opp], catalog: createTestCatalog(), seed });
    const b = runAutoMatch({ players: createTestPlayers(), decks: createTestDecks(), strategies: [greedyStrategy, opp], catalog: createTestCatalog(), seed });
    if (a.winnerId === 'p1') trainedWins++;
    if (b.winnerId === 'p1') defaultWins++;
  }
  console.log('out-of-sample (50 games):  trained=' + trainedWins + '  default=' + defaultWins);
});
"
```

Both `import()` paths are relative to the shell's current working directory (because `node -e` has no source file URL). Run this from the repo root; do not save the snippet to a file in `/tmp` — `import()` inside a file resolves relative to that file's location, which will 404.

(Rebuild the engine package first if it's stale: `cd packages/engine && vp pack`.)

If `trained >= default` on the out-of-sample seeds, the improvement is real. If `trained < default`, the hill-climber overfit the training seeds — re-train with higher `MATCHES` to lower per-eval noise.

Empirically, **a large training-seed Δ does not guarantee out-of-sample improvement** even at `--matches 20`. Example observed during skill maintenance: training vs `first-legal` over 15 iterations produced baseline 25.0% → best 60.0% (Δ 35pp), but out-of-sample (50 fresh seeds) reported trained=28 default=29 — the gains evaporated. When this happens:

1. First try doubling `MATCHES`. Per-eval variance shrinks with `sqrt(matches)`, so doubling cuts noise by ~30%.
2. If still not generalizing, the search likely fit fixture quirks. Re-run with `--real-cards` to broaden the deck distribution, or expand the verify block to 200+ games.
3. If `trained` and `default` are statistically tied (within ±10% on 50 games), treat the training Δ as **not** a real improvement — do not promote the weights.

## Step 5 — Report and optionally commit

Report a four-line summary to the user:

1. Baseline → best win-rate (training).
2. Accepted / total mutations.
3. Out-of-sample trained vs default (verification).
4. Path to the weights JSON.

Ask before doing any of:

- Committing the trained weights (`tools/ai-runner/trained/*.json`) into the repo.
- Wiring the trained weights into the practice flow (`apps/simulator/src/engine/practice/practiceEngine.ts`) — this changes the user-facing bot strength. The wiring point is `strategyForId(...)`: replace `return greedyStrategy` with `return createGreedyStrategy(bestWeights, "greedy-trained")` and import `createGreedyStrategy` plus the JSON from `@tcg/cyberpunk-engine` / the weights file.
- Promoting the trained weights as the new `DEFAULT_GREEDY_WEIGHTS` (`packages/engine/src/automation/strategies/greedy.ts`) — this changes behaviour everywhere, including engine unit tests that assert on default-greedy behaviour. Re-run the full engine test suite before proposing this.

## Common pitfalls

- **Training vs `random` saturates immediately at 100%.** Use `greedy` or `monte-carlo-greedy` as the opponent for any meaningful signal.
- **Engine package is stale.** The trainer runs through `@tcg/cyberpunk-engine`, which resolves to `packages/engine/dist/index.mjs` for node-driven invocations. After editing engine source, rebuild with `cd packages/engine && vp pack` before running the CLI. `vp test` does not require a rebuild (it resolves source through the workspace).
- **`--workers` is silently ignored in `train` mode.** The CLI accepts the flag without error but `trainGreedy` never reads it — the trainer is single-process by design (parallel candidates would break the strict best-so-far accept/reject invariant). Do not assume your training time scales with `--workers`.
- **The print-n-play decks are not yet wired into `ai-runner`.** `--real-cards` uses the synthetic builder in `real-catalog.ts`. If a request explicitly wants Arasaka vs Merc matchups, that's a deck-loading change in `real-catalog.ts`, not a trainer change — call it out instead of pretending the existing flag covers it.
- **Mutation noise can mask gains.** A single accepted mutation with `--matches 6` is one game-flip; demand `--matches >= 20` before quoting a Δ in a PR description.
- **Ties are rejected.** The accept rule is strict `winRate > best`, not `≥`. Mutations that match the baseline (e.g. 12/20 vs 12/20) are silently rejected even though they may carry equally good or better hidden parameters. Expect long stretches of `✗ rejected` against a mirror opponent — that's the harness behaving correctly, not stuck training.
- **Engine `dist/` cache.** `import('./packages/engine/dist/index.mjs')` in the Step 4 verify block reads the **built** engine, not the workspace source. If you edit `greedy.ts` and want the verify block to see those edits, rebuild first (`cd packages/engine && vp pack`). The trainer CLI itself transforms TS through `--experimental-transform-types`, but the verify snippet hits the compiled artifact.

## Source

- Bot architecture: `packages/engine/src/automation/README.md`
- Sample real decks: `packages/cards/src/decks/`
