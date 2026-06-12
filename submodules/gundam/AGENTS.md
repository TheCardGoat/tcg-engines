# Gundam Simulator Submodule

This is the Gundam Card Game implementation: engine, cards, simulator, server
adapter, docs, and bot tooling.

Production entry points:

- Platform pages: `https://tcg.online/gundam/*`
- Mounted simulator: `https://tcg.online/gundam/simulator`

Before rules-facing work, read `.agents/skills/gundam-tcg-rules.md` and keep
its glossary in context. Use `.agents/skills/gundam-rules.md` as the bundled
comprehensive rules reference and `.agents/skills/gundam-test-generation.md`
when adding focused behavior tests.

Platform runtime or shared simulator exposure should map Gundam concepts
through `../agnostic-simulator` contracts/adapters. Keep Gundam rules, cards,
engine semantics, and glossary-native wording inside this submodule.

## Where To Look

- `docs/architecture.md` - package boundaries and structural map.
- `docs/design-docs/core-beliefs.md` - engine invariants.
- `packages/engine/src` - rules engine, moves, turn flow, combat, effects, and
  deterministic runtime behavior.
- `packages/cards/src` - declarative card definitions.
- `packages/types/src` and `packages/token-data/src` - leaf packages for shared
  type/token data.
- `packages/server-adapter/src` - platform runtime adapter.
- `../agnostic-simulator/apps/multi-game-simulator/src/games/gundam` -
  migrated browser simulator source and practice/match routes.
- `tools/bot-bench` - bot and strategy evaluation.

## Bug Triage

- UI/practice bugs start in
  `../agnostic-simulator/apps/multi-game-simulator/src/games/gundam`, then move
  to `packages/engine` only when the visible state reflects an engine/runtime
  gap.
- Matchmaking or production live-game bugs cross platform `apps/game-server`,
  `apps/gateway`, and `packages/server-adapter` before reaching engine code.
- Card behavior bugs start with `packages/cards/src`, then test the engine path
  that interprets the declarative data.

## Agent Backpressure Gates

Use the root `/backpressured` command for long-running Gundam work. Read the
rules skill before rules-facing edits and keep the local architecture docs in
scope for package-boundary decisions.

- Card data behavior: add or update the sibling card/engine fixture before
  changing broad primitives.
- Engine/runtime behavior: focused engine test first, using injected clocks
  and `GameLogger` patterns where relevant.
- Simulator behavior: focused app or browser proof before broad CI.
- Bot or strategy work: validate with the bot-bench or harness command that
  rejects the changed behavior.

If a non-trivial change needs an execution plan, write it under
`docs/exec-plans/active/` before implementation and move it to `completed/`
when the work is done.

## House Rules

- Cards are data, not runtime code. Card files should not import engine runtime
  internals except in tests.
- Preserve one-way boundaries: `types`/`token-data` -> `cards`/`engine` ->
  `simulator`/platform adapter.
- Prefer the injected clock over `Date.now()` for new match logic so replays
  and tests stay deterministic.
- All match-side-effect logs go through `GameLogger`.
- For non-trivial changes, add a short plan under `docs/exec-plans/active/`
  before coding and move it to `completed/` when done.
