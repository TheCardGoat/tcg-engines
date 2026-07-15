# GD01 Behavior-First Card Quality Pass

**Status**: complete
**Owner**: Codex
**Started**: 2026-07-12
**Completed**: 2026-07-12

## Goal

Turn all 130 GD01 cards into executable behavior specifications. Every test
must start from a deterministic fixture, reach the scenario through legal
public player moves, and verify only prompts, legal actions, visible board
state, projected logs, or the game result. Shared engine and simulator gaps
exposed by GD01 must be fixed generically.

## Scope

- In scope: 86 Units, 12 Pilots, 24 Commands, and 8 Bases under GD01;
  bounded Gundam engine, type, token-data, adapter, protocol, and simulator
  changes required by their printed text; strict fixture and hidden-Shield
  enforcement for GD01.
- Out of scope: the preserved unfinished GD02 worktree, unrelated platform
  work, compatibility shims for legacy test shortcuts, per-card browser
  duplication when cards share an interaction family, and metadata snapshots
  used as behavior proof.

## Approach

- Work in a clean sibling worktree based on PR #2467 while it remains open.
  Recheck the ancestor immediately before publication and target the nearest
  valid completed behavior foundation.
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

## Known GD01 interaction families

- Twenty-eight Burst cards, including all eight Bases.
- Burst Bases that add the revealed Shield to hand and deploy themselves.
- Unit-token and EX Base deployment, including token projection and attack
  legality.
- Top-Deck reveal, choose, return, deploy, draw, discard, and mill flows.
- Pair, Link, paired-Pilot, and Command-as-Pilot behavior.
- Source-owned Attack and Destroyed effects, Support, Repair, Blocker,
  First Strike, High-Maneuver, Breach, and damage prevention.
- Multi-target damage, recovery, rest, return, and attack-target choices.
- Main, Action, and activated Action priority.

## Verification

- `vp test run packages/cards/src/cards/gd01 --configLoader runner`
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

- Finish only after every GD01 card, interaction-family proof, and required
  gate passes.
- Stop with exact evidence when a rules or architecture decision cannot be
  derived from the repository, or the same focused blocker remains after a
  minimal reproduction and reasonable generic fix attempt.

## Decision log

- 2026-07-12 — Preserve unfinished GD02 work in its isolated worktree and
  start GD01 from the latest completed behavior foundation.
- 2026-07-12 — Treat the 130-file/293-test baseline as untrusted: 84 files
  match strict anti-patterns and eight inspect declarative effect structure.
- 2026-07-12 — Apply strict fixture and hidden-Shield enforcement before card
  rewrites so weak tests are visible debt rather than late review findings.
- 2026-07-12 — The explicit user contract overrides historical examples that
  use `getG`, phase mutation, test-only combat, Shield seeders, raw derived
  state helpers, or hidden Deck/Shield identities.
- 2026-07-12 — Preserve the trigger boundary established by the newer-set
  passes: plain Attack belongs to the attacker and paired Pilot; plain
  Destroyed belongs to the destroyed card and paired Pilot; true observers
  require explicit event conditions.
- 2026-07-12 — Preserve rule 1-3-7 ordering and immediate defeat management:
  staged follow-ups are calculated after prior visible state changes and are
  suppressed once Deck loss ends the game.
- 2026-07-12 — Model Space and Earth as printed battlefield characteristics
  on the shared card model and project them through generic simulator entity
  metadata instead of maintaining GD01-only UI knowledge.
- 2026-07-12 — Represent branch-local interaction requirements explicitly in
  the game-agnostic protocol. A selected alternate deployment can therefore
  require its own target without making that target mandatory for an ordinary
  deployment published in the same action.
- 2026-07-12 — Announce ready/rested state only for cards in a matching public
  play zone. Cards in hand and Commands paired as Pilots no longer expose a
  misleading readiness affordance to assistive technology.
- 2026-07-12 — Publish the completed pass as stacked draft PR #2472 against
  the active GD03 behavior foundation in PR #2471.

## Results

- All 130 GD01 cards now have behavior-first coverage: 86 Units, 12 Pilots,
  24 Commands, and 8 Bases across 408 focused tests.
- The strict fixture audit covers 664 implemented cards and rejects raw state
  access, test-only state transitions, structural effect assertions, hidden
  Deck or Shield identity reads, and fixtureless card tests in the guarded
  sets.
- Generic engine fixes cover activated costs and target availability, staged
  effects, paired-card movement, token lifecycle, alternate deployment,
  Resource and EX Resource handling, Base replacement, repeated attacks after
  readying, and terminal Deck-loss ordering.
- Printed battlefield characteristics, numeric keywords, tokens, grouped
  targets, alternate modes, Command-as-Pilot choices, and Deck-look completion
  now survive the engine-to-protocol-to-simulator round trip.
- The independent final review found two interaction defects. Hosted tests now
  prove that GD01-002's alternate branch cannot be submitted without its
  destruction target, while ordinary deployment remains legal, and that only
  restable cards in public play zones announce ready/rested state.
- `pnpm run ci:gundam:check`, `pnpm run ci:agnostic:check`, the 664-card fixture
  audit, the root harness check, scoped formatting/type checks, and
  `git diff --check` pass.
