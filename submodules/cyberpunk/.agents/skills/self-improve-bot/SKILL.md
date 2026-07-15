---
name: self-improve-bot
description: Train and verify Cyberpunk greedy-strategy weights with the ai-runner hill climber. Use when changing greedy automation, trainer behavior, bot heuristics, or evaluating a candidate weight set.
---

# Self-Improve Cyberpunk Bot

Before changing game behavior, load `cyberpunk-tcg-rules`. Then inspect:

- `packages/engine/src/automation/README.md`
- `packages/engine/src/automation/strategies/greedy.ts`
- `tools/ai-runner/src/train.ts`
- `tools/ai-runner/src/cli.ts`

## Contract

The trainer mutates `GreedyWeights`, evaluates each candidate against a fixed
opponent and seed batch, and accepts only strictly better win rates. Training
results are candidates, not proof: promote weights only after a fresh-seed
comparison against the default strategy.

## Workflow

1. Run focused automation and trainer tests. Record unrelated baseline failures;
   do not silently classify warnings as safe.

```bash
bun test packages/engine/tests/automation tools/ai-runner/tests
```

2. Choose an opponent with headroom. Avoid a saturated matchup where the
   baseline already wins nearly every game.
3. Train with a stable seed and explicit output path:

```bash
node --experimental-transform-types tools/ai-runner/src/cli.ts train \
  --opponent greedy \
  --matches 20 \
  --iterations 40 \
  --seed self-improve-<run-id> \
  --output tools/ai-runner/trained/weights-<run-id>.json
```

Use `--real-cards` only when the requested evaluation should use the real card
catalog. Read `tools/ai-runner/src/real-catalog.ts` before claiming what deck
distribution that flag represents.

4. Confirm the output schema contains `bestWeights`, baseline and best win
   rates, opponent, match count, iterations, and seed.
5. Compare the trained strategy with the default on a different seed batch.
   Use enough games to distinguish a stable gain from one or two game flips.
6. Treat a tie or fresh-seed regression as no demonstrated improvement. Increase
   the match count or broaden the evaluation; do not promote the weights.
7. Re-run focused engine tests after any default-weight or strategy change.

## Promotion Gates

Ask before committing generated weight artifacts or changing user-facing bot
strength. There are two separate integration surfaces:

- Engine default: `packages/engine/src/automation/strategies/greedy.ts`
- Practice UI adapter:
  `../agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/engine/practice/practiceEngine.ts`

The practice adapter currently resolves registered strategies through
`getSafeAutomatedActionStrategyOption`. Re-read that code before deciding
whether a trained strategy belongs in the engine registry or the adapter; do
not replace it with an obsolete hard-coded `greedyStrategy` recipe.

## Report

Include the training seed and parameters, baseline and best training results,
fresh-seed trained-versus-default result, output path, focused checks, and a
clear `promote` or `do not promote` conclusion.
