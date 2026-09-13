# Gundam Submodule

This is the Gundam Card Game implementation: engine, cards, server adapter,
docs, and bot tooling. The browser simulator lives in `../agnostic-simulator`.

Before rules-facing work, load
`.agents/skills/gundam-tcg-rules/references/glossary.md`, then
`.agents/skills/gundam-tcg-rules/SKILL.md`. Keep the glossary in context and
use the skill index before opening the comprehensive rules. Use
`.agents/skills/gundam-test-generation/SKILL.md` when adding focused behavior
tests and `.agents/skills/gundam-cards/SKILL.md` for single-card work. Bot
evaluation belongs to `.agents/skills/gundam-bot-bench/SKILL.md`.

Keep Gundam rules, cards, engine semantics, and glossary-native wording inside
this submodule. The parent guide owns cross-workspace adapter and route rules.

## Supported Match Scope

The product implementation, required behavior tests, and review triage target
the standard two-player game described by rule 1-1-1. Battle royale and team
rules for three or more players in comprehensive-rules section 12 are out of
scope unless the user explicitly requests multiplayer work.

Model exactly one opponent in fixtures and implementation decisions. Printed
phrases such as "each enemy player" therefore apply to that single opponent.
Do not create blockers solely for multiplayer fan-out, but do preserve the
printed controller of every choice: a wrong decision owner in a 1v1 match is
still a supported-game bug.

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

## Validation Gates

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
