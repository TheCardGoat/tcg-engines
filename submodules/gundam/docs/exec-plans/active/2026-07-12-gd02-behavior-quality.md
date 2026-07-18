# GD02 Behavior-First Card Quality Pass

**Status**: in-progress
**Owner**: Codex
**Started**: 2026-07-12

## Goal

Turn all 130 GD02 cards into executable behavior specifications. Every test
must start from a deterministic fixture, reach the scenario through legal
public player moves, and verify only prompts, legal actions, visible board
state, projected logs, or the game result. Shared engine and simulator gaps
exposed by GD02 must be fixed generically.

## Scope

- Card-by-card review index: [GD02 behavior matrix](2026-07-12-gd02-behavior-matrix.md).
- In scope: 84 Units, 15 Pilots, 21 Commands, and 10 Bases under GD02;
  bounded Gundam engine, type, token-data, adapter, protocol, and simulator
  changes required by their printed text; strict fixture and hidden-Shield
  enforcement for GD02.
- Out of scope: unrelated platform work, compatibility shims for legacy test
  shortcuts, per-card browser duplication when cards share an interaction
  family, and metadata snapshots used as behavior proof.

## Approach

- Recover GD02 on the GD01 lineage that owns its reusable engine/protocol
  foundation. Once GD01 and GD03 are merged, replay only the GD02 commits onto
  current `origin/main` and publish against `main` without duplicating their
  squashed histories.
- Enable the strict fixture and Shield-identity gates before mass edits so
  existing raw state/runtime reads, effect injection, gameplay shortcuts,
  structural assertions, hidden identities, skips, and fixtureless tests fail
  immediately.
- Inventory every printed timing, condition, cost, target, optional branch,
  duration, source destination, terminal-game edge, and interaction family.
- Divide card-only files by collector range. Keep engine, types, harness,
  token data, protocol, and simulator files under one shared owner.
- Fix the narrowest reusable owner when a card exposes a gap. Cards remain
  declarative; shared protocol concepts remain game-agnostic.
- Add real-card hosted round trips once per distinct interaction family, not
  synthetic payload-shape tests or one simulator test per card.
- Perform an adversarial review for trigger ownership, staged resolution,
  terminal Deck loss, target assignment, simultaneous Bursts, hidden
  information, token hydration, action priority, and stale prompts before
  broad validation.

## Behavior contract

1. Create a `GundamTestEngine` fixture.
2. Use legal public player actions to reach and resolve the scenario.
3. Inspect every public choice explicitly; do not blindly drain prompts.
4. Assert only player/simulator-visible behavior.
5. If the public action or query is missing, fix the generic engine/protocol
   surface instead of mutating state or asserting `effects` structure.

Deck and face-down Shield counts are public. Their identities and order are
private until a legal reveal publishes them.

## Known GD02 interaction families

- Thirty-one Burst cards, including all ten Bases.
- T-012 Daughtress creation and targeting.
- Suppression and simultaneous Shield/Burst ordering.
- Top-Deck reveal, choose, return, deploy, and mill flows.
- EX Resource placement and dependent effects.
- Source-owned and paired-Pilot Attack effects.
- Destroyed effects on Units, Bases, and their paired Pilots.
- Commands with both Command and Pilot text.
- Main, Action, and activated Action priority.

## Verification

- `vp test run packages/cards/src/cards/gd02 --configLoader runner`
- `vp test run packages/engine --configLoader runner`
- `vp test run packages/cards/src/cards --configLoader runner`
- `pnpm run check:harness`
- `vp check --no-fmt` and `vp fmt --check` in `submodules/gundam`
- focused adapter/protocol/live/simulator tests and Gundam adapter typecheck in
  `submodules/agnostic-simulator`
- `pnpm run ci:gundam:check`
- `pnpm run ci:agnostic:check`
- scoped forbidden-pattern audit and `git diff --check`

## Stop conditions

- Finish only after every GD02 card, interaction-family proof, and required
  gate passes.
- Stop with exact evidence when a rules or architecture decision cannot be
  derived from the repository, or the same focused blocker remains after a
  minimal reproduction and reasonable generic fix attempt.

## Decision log

- 2026-07-12 — Treat the inherited 130-card test baseline as untrusted because most
  files still depend on raw state, shortcuts, hidden identities, or structural
  card assertions.
- 2026-07-12 — Recovered the unpublished GD02 worktree: it contained one plan
  commit plus 67 uncommitted paths, but no remote branch or pull request. The
  work was checkpointed without dropping files, rebased, and renamed to
  `codex/gd02-card-behavior`.
- 2026-07-12 — Rebased the recovery branch onto GD01 rather than duplicating
  its active engine work. The resulting GD02 baseline was 293/295 focused
  tests, with strict fixture/visibility debt still intentionally failing.
- 2026-07-12 — Apply strict fixture and hidden-Shield enforcement before card
  rewrites so weak tests are visible debt rather than late review findings.
- 2026-07-12 — The explicit user contract overrides historical examples that
  use `getG`, phase mutation, test-only combat, Shield seeders, or raw derived
  state helpers.
- 2026-07-12 — Preserve the GD03 trigger boundary: plain `Attack` belongs to
  the attacker and paired Pilot; plain `Destroyed` belongs to the destroyed
  card and paired Pilot; true observers require explicit event conditions.
- 2026-07-12 — Preserve rule 1-3-7 ordering and immediate defeat management:
  staged follow-ups are calculated after prior visible state changes and are
  suppressed once Deck loss ends the game.
- 2026-07-12 — Model `If you do, choose ...` as a later protocol prompt with
  target answers committed per directive. Preserve a single grouped prompt
  only when card data explicitly marks a dependent directive as sharing the
  preceding printed choice.
- 2026-07-12 — Evaluate Destroyed pair qualifications and battle-defeated-card
  predicates against last-known paired Pilot identity. Do not make card tests
  reconstruct that private engine state.
- 2026-07-12 — Add grouped `and`/`or` attribute predicates and keyword-aware
  Unit counts at the shared DSL layer for exact GD02 tutor and constant-effect
  eligibility.
- 2026-07-12 — Replayed only the three GD02 commits onto merged `origin/main`
  after GD01 and GD03 landed. Preserved upstream deferred Command post-actions
  while retaining staged target commitments and generic interaction fixes.
- 2026-07-12 — Closed the final legality debt so all 130 GD02 cards prove both
  printed Lv. and active-cost rejection through public moves. The focused set
  passes 130 files / 697 tests; the full card gate passes 756 files / 2,444
  tests; the engine passes 101 files / 621 tests.
- 2026-07-13 — Closed review follow-ups with public-move proofs for short
  mandatory discards, Shield-only versus full shield-area prevention, and
  destroy-by-battle triggers against declared Blockers across First Strike and
  simultaneous destruction. Pending paired-Pilot effects now retain their
  source Unit identity after destruction cleanup.
- 2026-07-12 — Kept source-owned Deploy/Pair routing strict and migrated the
  affected GD03/GD04 behavior proofs instead of restoring fused or repeated
  prompts. Nested prerequisite choices now resolve before `resolveThenQueue`
  follow-ups, which still preempt unrelated older choices.
