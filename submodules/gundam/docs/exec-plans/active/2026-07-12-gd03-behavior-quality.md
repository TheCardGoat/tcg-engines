# GD03 Behavior-First Card Quality Pass

**Status**: implementation complete; draft PR #2467 open
**Owner**: Codex
**Started**: 2026-07-12

## Goal

Turn all 132 GD03 cards into executable behavior specifications. A passing
test file is insufficient: each card must be reached through legal player
actions and verified through public prompts, visible board state, legal move
queries, projected logs, or the game result. Shared engine and simulator gaps
exposed by the set must be fixed generically.

## Scope

- In scope: all GD03 card definitions and sibling tests; bounded Gundam engine
  and type changes required by printed text; Gundam adapter/protocol and
  simulator proofs for distinct GD03 interaction families; strict fixture
  harness enforcement for GD03.
- Out of scope: unrelated platform code, generic browser redesign, per-card
  Playwright duplication when a card introduces no new interaction family,
  and compatibility shims for obsolete behavior.

## Approach

- Base the work on the GD04 behavior/protocol foundation from PR #2466.
- Generalize the strict fixture gate before mass test edits so GD03 rejects
  raw state/runtime reads, effect injection, gameplay shortcuts, structural
  assertions, hidden-deck inspection, skipped tests, and fixtureless tests.
- Divide the set by card type and collector range. Card-batch owners may edit
  only their definitions and sibling tests; shared engine, types, protocol,
  and simulator files have one owner.
- For every card, decompose printed text into timing, conditions, costs,
  targets, branches, duration, and source-card destination. Use the real card
  under test and public player moves after fixture creation.
- Triage failures at the narrowest owner: card data first, then reusable
  engine primitive, then game-agnostic adapter/protocol mapping.
- Add real-card protocol/UI round trips for each interaction family rather
  than synthetic prompt or payload-shape tests.
- Run a separate adversarial review for terminal draws/mills, simultaneous
  ordering, target assignment, combat event timing, hidden information, and
  scoped skips/TODOs before broad CI.

## Verification

- `vp test run packages/cards/src/cards/gd03 --configLoader runner`
- `vp test run packages/engine --configLoader runner`
- `vp test run packages/cards/src/cards --configLoader runner`
- `node tools/harness/check-card-fixtures.mjs`
- `vp check --no-fmt` and `vp fmt --check` in `submodules/gundam`
- focused adapter/protocol/UI tests and Gundam adapter typecheck in
  `submodules/agnostic-simulator`
- `pnpm run ci:gundam:check`
- `pnpm run ci:agnostic:check`
- scoped forbidden-pattern audit and `git diff --check`

Latest result (2026-07-12):

- GD03 card suite: 132 files, 415 tests passed.
- Full card suite: 756 files, 1,889 tests passed.
- Gundam engine: 89 files, 583 tests passed.
- Focused adapter/protocol/simulator coverage: 4 files, 53 tests passed.
- Gundam and agnostic CI-equivalent workflows passed.
- Gundam and agnostic type/lint checks, formatting, adapter typecheck, strict
  644-card fixture harness, scoped forbidden-pattern audit, and diff check
  passed.

## Open questions

- Which GD03 cards expose unsupported printed behavior after strict tests are
  installed? Resolve each against Comprehensive Rules 1.7.0 before choosing
  a card-data or engine fix.
- Which GD03 interaction families lack a real-card protocol/UI round trip?
  Determine after the behavior matrix and add the smallest representative
  set.

## Decision log

- 2026-07-12 — Treat all existing GD03 tests as untrusted despite the current
  132-file/336-test green baseline because many inspect or mutate raw state.
- 2026-07-12 — Apply the strict gate before rewriting cards so weak tests fail
  immediately rather than becoming late review debt.
- 2026-07-12 — Keep shared runtime and protocol changes under one owner while
  card batches run in parallel to preserve deterministic boundaries.
- 2026-07-12 — Treat `destroyed` as the destroyed card's own keyword timing
  (Comprehensive Rules 13-2-8). Battle-destruction observers use the existing
  `onDestroyByBattle` event; board-wide scanning of every `destroyed` ability
  is invalid and caused paired Pilots to activate twice in simultaneous combat.
- 2026-07-12 — Resolve sequential interaction text by enqueuing ordinary
  follow-up effects after the first state change. Mill-then-target,
  recover-then-discard, and draw-then-discard therefore reuse the generic
  target-selection protocol without exposing hidden cards or preselecting a
  card that is not yet in the legal zone.
- 2026-07-12 — Represent optional Base-rest substitution as a normal public
  target selection over every eligible substitute plus the original Base.
  Exact runtime candidates let the simulator highlight duplicate card names;
  choosing the Base is the explicit decline path.
- 2026-07-12 — Stop staged effects as soon as drawing or milling the last card
  ends the game. A terminal result must not leave a stale target interaction
  for Nyaan, A Healthy Curiosity, or the other mill-then-target actions.
- 2026-07-12 — Enforce generated-token text through typed, generic Unit
  restrictions. `cannotPairPilot` is checked by pairing legality and
  `cannotSetActive` is checked both during the Start Phase and by effects that
  would ready the Unit.
- 2026-07-12 — Treat a printed token number as simulator-visible behavior.
  T-013 through T-017 now have shared token-printing metadata, and a real-card
  projection test proves their final simulator names and artwork URLs.
- 2026-07-12 — A face-down Shield count is public; its instance identity is
  not. GD03 fixtures may identify a Burst source only after legal reveal, and
  the strict harness rejects pre-reveal Shield identity captures.
- 2026-07-12 — Treat plain `【Attack】` text as owned by the attacking Unit and
  its paired Pilot. Attack effects on other cards enter the observer scan only
  when their conditions explicitly bind the event source or player, preserving
  printed text such as The-O's "when one of your other Units attacks" without
  activating unrelated bystanders.
- 2026-07-12 — Coalesce identical printed target groups before checking whether
  required targets can be assigned. This preserves shared-target effects while
  still suppressing prompts whose distinct required slots cannot be filled.
- 2026-07-12 — Reset action priority after a player plays a Command or activates
  an Action ability. The public pass sequence must describe the actual player
  interaction rather than inherit stale pass state from an earlier action.
- 2026-07-12 — Rebuild hosted token definitions through one shared engine
  helper. Serialized `TokenSpec` remains authoritative for gameplay and
  restrictions, while printed token data contributes public presentation;
  unprinted tokens keep a usable visible fallback after live updates and cold
  joins.
