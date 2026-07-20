# Gundam Command Heuristic Iteration

## Goal

Improve the promoted `combat-aware` bot's Command decisions: whether to spend
the card and Resources, which legal target to choose, when to hold an Action
Command, and whether a dual-mode Command is worth more as a Command or Pilot.

## Rules constraints

- Command timing remains governed by rules 3-4-5, 7-5-2-1, 8-4, 9, and
  10-1-8.
- Required targets must remain legal under rules 10-1-8-1-1 and 10-2-2.
- Command-as-Pilot comparison applies only during the Main Phase under rules
  3-4-6-2 and 13-2-4-2.

## Baseline and boundaries

- Parent strategy: canonical `combat-aware`.
- Experiments live in `tools/bot-bench` until a candidate survives holdout.
- Use identical paired seeds, deck cells, and both seats for comparisons.
- Do not change Command rules or card definitions to improve bot results.
- Preserve unrelated simulator changes and externally committed evidence.

## Hypotheses

1. Reject zero-impact or low-impact Commands instead of playing every legal
   candidate.
2. Rank legal targets by realized damage, recovery, removal, rest, and stat
   value rather than enumerator order.
3. Charge Command utility for Resource opportunity cost when development is
   still available.
4. Compare a dual-mode Command's immediate effect with its persistent Pilot
   AP/HP/keyword value instead of always preferring Pilot mode.
5. During an Action Step, require combat-relevant or otherwise urgent value.
6. Combine only independently safe levers.

## Acceptance gates

- Focused tests cover zero-impact recovery, lethal damage, target ranking,
  Resource conservation, Action timing, and Command-versus-Pilot selection.
- Strict runs have zero rejected moves and exercise both `playCommand` and
  `playCommandAsPilot` where the deck permits them.
- Reject any confirmation candidate with a deck-cell regression of 5
  percentage points or more.
- Promote only after a fresh 240-block canonical holdout with positive 95%
  confidence interval, at least 2 percentage points mean improvement, and no
  hard failures.
- Re-run deterministic replay, engine/BotLab tests, and built-in-browser proof
  if a new default is promoted.

## Stop conditions

- Stop after six coherent hypotheses if none clears confirmation.
- Stop on rules illegality, nondeterminism, or repeated benchmark-integrity
  failure until the underlying issue is understood.

## Progress

- [x] Inspect current Command policy, rules, and baseline family telemetry.
- [x] Add isolated experimental Command policies and focused tests.
- [x] Run paired common-seed screens.
- [x] Confirm the strongest candidate on a larger fresh schedule.
- [x] Run canonical holdout and promote only if all gates pass.
- [x] Run replay, tests, strict matches, and browser proof.

## Results

- Immediate target utility and Command-versus-Pilot scoring were behaviorally
  neutral on the initial 72-match screens.
- Unconditional development-first ordering was deck-sensitive: positive on
  `gd01-mixed`, neutral-to-positive on `ef-starter`, and negative on
  `seed-aggro`.
- The accepted policy preserves removal, board-creating Commands, lethal
  effect damage, and useful keyword grants, while deferring attrition/setup
  Commands behind legal Unit/Base development.
- Fresh confirmation used 288 paired, seat-swapped games across all three
  deck cells. Mean win-rate delta was +3.82 percentage points with a normal
  paired 95% confidence interval of +0.88 to +6.76 points (15 gained games,
  4 lost). Deck deltas were +2.08 points (`ef-starter`), 0 (`seed-aggro`),
  and +9.38 points (`gd01-mixed`).
- The fresh canonical 240-block holdout used engine revision
  `fnv1a32:7a8aea2f` and completed 640 matches with zero hard failures. Mean
  paired improvement was +6.25 percentage points with a 95% confidence
  interval of +2.5 to +10 points, so the promotion record now describes the
  Command-aware production implementation rather than its predecessor.
- All confirmation and canonical smoke games ended through normal game wins
  with zero configured hard failures.
- Canonical replay reproduced exactly. Engine checks, 34 focused automation
  tests, and all 22 BotLab tests passed.
- Built-in browser proof completed a 120-move bot-vs-bot game on turn 10,
  retained the visible desktop event log, reached the normal result modal,
  and emitted no browser warnings or errors.

## Decision

Promote the tempo-aware Command policy into canonical `combat-aware`. Keep the
more aggressive resource and dual-mode variants experimental because they did
not independently clear the cross-deck gate.
