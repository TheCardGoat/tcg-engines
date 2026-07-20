# Gundam Canonical Card Behavior Audit

**Status**: completed
**Owner**: Codex coordinator
**Started**: 2026-07-18
**Branch**: `codex/gundam-card-audit-waves`

## Goal

Implement and behavior-test every remaining canonical Gundam ability card.
Each printed clause must be driven through public game commands and proved
through player-visible state, prompts, legal actions, logs, or game results.

## Canonical Inventory

- Authored definition files: 848.
- Unique canonical card IDs: 788.
- BETA duplicate definitions: 60; these share canonical IDs with later set
  definitions and are checked for parity rather than counted twice.
- Canonical cards with authored effects or printed keywords: 572.
- Strictly audited GD01-GD04 ability cards: 455.
- Wave one verified 50 ST01-ST04 ability cards through 462 focused tests.
- Wave two verified the next 50 ST04-ST08 ability cards through 464 focused
  tests.
- The final partial wave verified 17 ST08-ST09 and token ability cards through
  154 focused tests.
- Verified canonical ability cards: 572; 0 remain.
- Reminder/setup-only EX Base, EX Resource, and Resource definitions are not
  ability-card work. Vanilla cards belong to a parameterized catalog invariant.

The queue is ordered by release set and numeric card number. The canonical
non-BETA definition owns behavior when a historical BETA definition shares the
same card ID.

## Coordination

Work proceeds in 50-card waves: exactly ten implementers own five definition
and sibling-test pairs each. Implementers never edit shared engine, parser,
types, projection, harness, inventory, plan, skill, or Git state. Shared defects
return to the coordinator with a minimal reproduction.

The agent runtime permits three implementers alongside the coordinator, so the
ten assignments are scheduled in batches without changing wave ownership.

## Card Contract

For every non-vanilla card:

1. Decompose every printed timing, cost, condition, target, choice, branch,
   duration, restriction, and event source.
2. Compare the printed contract with the authored structured effect and fresh
   parser output.
3. Use `GundamTestEngine` public commands only after deterministic fixture
   creation.
4. Assert observable behavior, including negative legality and target paths.
5. Stop on unexplained focused failures and classify the first contradicted
   layer.

## Released Waves

The exclusive assignments, freeze ledgers, focused checks, shared repairs, and
release evidence are recorded in:

- `docs/card-audit/checkpoints/wave-001.md`
- `docs/card-audit/checkpoints/wave-002.md`
- `docs/card-audit/checkpoints/wave-003.md`

All three waves are released. The deterministic canonical queue reports 572 / 572
ability cards verified and no next card.

## Wave Gate

After all ten implementers freeze, the coordinator will:

1. Review the complete shared-worktree diff and every printed clause.
2. Repair shared defects centrally and run their smallest rejecting tests.
3. Run all 50 focused card files, affected package checks, card/engine suites,
   harness checks, formatting, and the Gundam local CI gate.
4. Update inventory counts, the next card, the checkpoint learning record, and
   any skill guidance justified by repeated evidence.
5. Stage explicit paths, run `git diff --cached --check`, commit, and push.

GitHub checks, comments, reviews, and CI are intentionally outside this
campaign. Local validation remains mandatory.

## Stop Conditions

- A material rule or architecture decision cannot be derived from official or
  repository evidence.
- The same focused blocker survives a minimal reproduction and one reasonable
  repair attempt.
- Safe shared-worktree ownership cannot be maintained.
- The complete inventory is verified and all chosen local gates pass.

## Completion Evidence

- `node tools/audit-canonical-card-queue.mjs`: 848 definitions, 788 canonical
  cards, 572 canonical ability cards, 572 verified, 0 remaining.
- Parameterized vanilla catalog: 93 canonical non-token no-ability Units and 17
  vanilla Unit tokens through 205 tests, covering printed deployment cost,
  token Lv./cost, and simulator-visible printed stats.
- Card package: 749 files / 3,425 tests PASS.
- Engine package: 103 files / 624 tests PASS.
- Parser: 8 files / 315 tests PASS; structured snapshot regenerated for all
  848 definitions.
- Strict harness: 617 card fixtures PASS; inventory, public-command, hidden
  identity, instruction, and document-drift checks PASS.
- Gundam workspace check and local CI graph PASS; 8 / 8 tasks successful.
- GitHub automation remained intentionally out of scope.
