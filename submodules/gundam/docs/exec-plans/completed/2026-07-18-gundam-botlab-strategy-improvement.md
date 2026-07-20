# Gundam BotLab Strategy Improvement

**Status**: completed
**Owner**: Codex
**Started**: 2026-07-18

## Goal

Make Gundam strategy iteration trustworthy and useful through BotLab, then
improve the production bot's strategic decisions against a fixed paired
baseline. A successful result must choose stronger actions for explainable
reasons, not merely gain win rate through automation concessions, false
timeouts, hidden-information drift, or unstable seeds.

## Acceptance Criteria

- `bot-lab doctor --game gundam` runs without importing or failing through an
  unrelated game adapter.
- Clockless headless matches cannot expose `skipOpponentTurn` or
  `dropOpponent`, and promotion matches end through real Gundam rules rather
  than manufactured timeout wins.
- Required and optional effect decisions enumerate executable answers without
  `MISSING_OPTIONAL_ANSWER`, pending-effect pass leakage, or automation
  concession on the fixed readiness matrix.
- Gundam provides a usable BotLab candidate-generation workflow that emits a
  schema-valid, current manifest without requiring hand-computed engine or card
  hashes.
- Doctor exercises a real deterministic match/replay smoke rather than only
  counting registered decks.
- Strategy implementation changes invalidate stale manifests through a real
  engine/strategy revision fingerprint.
- One strategic hypothesis at a time is compared in both seats with identical
  decks and seeds. Keep a candidate only when paired results, hard-failure
  counts, and move-family statistics improve or remain healthy.
- The selected production candidate passes focused tests, full engine and
  BotLab checks, deterministic replay, promotion dry-run, and a full simulator
  match.

## Baseline Evidence

- Unified CLI: `bot-lab doctor --game gundam` fails before reaching Gundam
  because the eager Lorcana adapter import cannot resolve
  `@tcg/lorcana-engine` from its simulator-owned source file.
- Isolated Gundam doctor reports three decks and `value-ranked`, but performs no
  match or replay check.
- Isolated paired evaluation (`tempo` vs `value-ranked`, seed base
  `gundam-botlab-readiness`) rejected with four automation concessions across
  eight matches.
- Standalone `iter-production` vs `value-ranked`, six matches with seed base
  `botlab-readiness-2026-07-18`, produced three automation concessions and
  `EFFECT_PENDING`, `MISSING_OPTIONAL_ANSWER`, and `WRONG_STEP` failures.
- Production control (`value-ranked` mirror, 12 matches with seed base
  `botlab-production-control-2026-07-18`) completed but eleven matches ended as
  false timeout wins and eleven `resolveEffect` attempts failed with
  `MISSING_OPTIONAL_ANSWER`.

## Patch Loop

1. Fix adapter isolation and add a CLI regression proving Gundam doctor can run
   without loading Lorcana.
2. Fix clockless administration-move availability and add engine enumeration
   and execution regressions.
3. Reproduce one optional effect failure by seed, fix the owning effect
   procedure/candidate path, and repeat until the fixed matrix has no hard
   automation failures or unexplained error codes.
4. Add Gundam manifest generation/training and strengthen doctor/revision
   checks with focused adapter tests.
5. Capture a clean paired production baseline.
6. Evaluate the existing experimental strategy stack, inspect family deltas,
   and form one new strategic hypothesis only after the previous candidate is
   accepted or rejected.
7. Register and promote only the strongest production-eligible oracle strategy
   after full evidence.

## Verification

- Focused engine automation, time-control, candidate-enumerator, and effect
  tests after each engine patch.
- Focused BotLab CLI/adapter/evaluate/promote tests after each shared-tool patch.
- Gundam bot-bench with explicit strategies, decks, match count, seed base,
  max actions, report path, and strict `--fail-on` policy.
- Paired BotLab evaluation in both seats across all registered promotion deck
  pairs, plus deterministic replay of sampled matches.
- Package `vp check`, full engine tests, BotLab tests/types, and relevant root
  owner gates at batch boundaries.
- Built-in browser bot-vs-bot full-match proof for the final strategy.

## Outcome

- BotLab adapters now load on demand, and Gundam doctor runs an actual
  deterministic rules-complete match. Gundam training emits schema-valid
  manifests with current engine and catalog fingerprints.
- Clockless automation no longer exposes timeout administration moves;
  composed strategies cannot select concession; optional Burst activation
  enumerates explicit accept/decline answers.
- The repaired 12-match `value-ranked` control ended entirely through Shield
  loss with no failed actions. The old `iter-production` recommendation was
  rejected after evaluation integrity was restored.
- The canonical `strategic` candidate develops and pairs before combat,
  mulligans hands without an early Unit, and prioritizes direct attacks only
  in the two-Shield closing window.
- Current-revision holdout `gundam-strategic-canonical-holdout-v3` passed 240
  paired blocks / 640 matches: +11.25 percentage points mean improvement, 95%
  CI +7.29 to +15.10, positive results in all three deck cells, and zero hard
  failures or non-rules endings.
- Deterministic replay and promotion dry-run passed. `strategic` is the current
  promoted default and is exposed as the VS-AI `Ace` opponent.
- Final gates: 632 engine tests, 15 BotLab tests, focused simulator tests and
  checks, a strict 24-match no-error bench, and a built-in-browser game ending
  at Turn 20 after 211 moves by Shield loss. Desktop logs stayed visible;
  mobile exposed the top-rail LOG control and opened the Game log panel. All
  23 inspected mid-game card images loaded.

## Stop Conditions

- Complete only when every acceptance criterion has current evidence and the
  selected strategy improves the paired decision-quality signal without hard
  failures or evaluation contamination.
- Keep the goal active while useful code, test, or evaluation work remains.
- Stop for product input only if two strategies are statistically and
  behaviorally indistinguishable after the promotion cap or if a rules choice
  cannot be derived from comprehensive rules and card text.

## Decision Log

- 2026-07-18 — Repair evaluation integrity before tuning heuristics; a strategy
  cannot be judged against false timeouts or automation concessions.
- 2026-07-18 — Use `value-ranked` as the initial production baseline because it
  is the current promoted default, while treating its bootstrap promotion
  record as unproven.
- 2026-07-18 — Preserve the oracle information policy during this loop. Public
  versus oracle comparisons are invalid for promotion and require a separate
  product initiative.
- 2026-07-18 — Reject the pre-integrity `go second`, tempo, and old production
  recommendations. Their apparent gains depended on false timeout or
  concession outcomes; paired reruns were neutral or negative.
- 2026-07-18 — Promote `strategic` only after a second, canonical holdout with
  the production thresholds and an independent seed passed every cell.
- 2026-07-18 — A 20-block-per-cell refresh rejected early on an EF mirror
  regression. Do not use it as promotion evidence; rerun a predeclared
  80-block-per-cell batch so the regression gate receives an adequately sized
  cell. That current-revision batch passed all cells.
