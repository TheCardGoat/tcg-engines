---
name: gundam-bot-bench
description: Run reproducible Gundam bot self-play, diagnose strategy or engine failures, and compare heuristic candidates with tools/bot-bench. Use for bot fuzzing, strategy changes, deadlocks, illegal moves, or win-rate evaluation.
---

# Gundam Bot Bench

The bench is a behavioral sensor, not a substitute for focused tests. Read
`tools/bot-bench/README.md`, the CLI help in `scripts/bench.ts`, and the current
strategy registry before choosing arguments.

## Reproducible Run

From `submodules/gundam/tools/bot-bench`:

```bash
vp run bench -- \
  --p1 greedy-legal --p2 value-ranked \
  --p1-deck ef-starter --p2-deck seed-aggro \
  --matches 100 --seed-base candidate-1 \
  --out reports/baseline.json
```

Use the same strategies, decks, match count, and seed base for candidate
comparisons. Then run:

```bash
vp run diff -- \
  --baseline reports/baseline.json \
  --candidate reports/candidate.json \
  --for p1 --out reports/diff.json
```

## Workflow

1. Run focused engine automation and bot-bench tests first.
2. Capture a baseline report with explicit parameters.
3. Form one hypothesis from termination reasons, illegal-move errors, family
   attempt/success rates, or repeatable strategy behavior.
4. Make one typed strategy or engine change.
5. Add a focused regression test for every illegal move, deadlock, or engine
   exception found by self-play.
6. Re-run both seats with the same seed base and compare reports.
7. Keep a heuristic only when the relevant behavior improves without masking a
   family regression. A small win-rate swing alone is insufficient.

## Boundaries

- Read current CLI flags; do not use obsolete `--games`, `--decks`, or `--seed`
  aliases.
- Full reports are reproducible artifacts and normally stay uncommitted.
- UI exposure belongs in
  `../agnostic-simulator/apps/multi-game-simulator/src/games/gundam`, not a
  simulator app inside this workspace.
- Stop after one hypothesis unless the user explicitly requests an autonomous
  loop with acceptance and stop criteria.

Report parameters, seed base, baseline/candidate results, family deltas,
focused tests, and a keep/reject conclusion.
