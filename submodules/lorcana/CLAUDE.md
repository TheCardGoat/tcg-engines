# Lorcana Submodule

This submodule owns the Lorcana cards, engine, simulator, server adapter, replay
tools, and Lorcana-specific agent skills.

Production entry points:

- Platform pages: `https://tcg.online/lorcana/*`
- Simulator path: `https://tcg.online/lorcana/simulator`
- Some replay/bug reports may still reference the legacy simulator origin
  `https://new.lorcanito.com`.

Before rules-facing work, load `.agents/skills/lorcana-rules/SKILL.md`. For
card work, also use `.agents/skills/lorcana-find-card/SKILL.md`,
`.agents/skills/lorcana-cards/SKILL.md`, and
`.agents/skills/lorcana-test-generation/SKILL.md` as needed.

Platform runtime or shared simulator exposure should map Lorcana concepts
through `../agnostic-simulator` contracts/adapters. Keep Lorcana rules, cards,
engine semantics, and glossary-native wording inside this submodule.

## Where To Look

- `packages/lorcana/lorcana-engine/src` - core engine, runtime moves,
  resolutions, effects, prompts, automation, and tests.
- `packages/lorcana/lorcana-cards/src` - card definitions and generated card
  exports.
- `packages/lorcana/lorcana-types/src` - shared Lorcana types.
- `packages/lorcana/lorcana-simulator/src` - Svelte simulator UI, devtools,
  fixtures, and local player-facing flows.
- `packages/lorcana/lorcana-server-adapter/src` - adapter consumed by platform
  runtime services.
- `packages/tools/replay-cli/src` - replay download/inspection tooling.
- `packages/shared/src` - shared helpers used by Lorcana packages.

## Bug Triage

- Player-reported gameplay bugs should start from the replay id/game id and the
  exact turn when available. Use the replay-debugging skill when inspecting a
  real production game.
- Platform bug-triage UI and admin pages live in `../platform/apps/web`; replay
  persistence, triage summaries, and queues live in `../platform/packages/api-core`
  and `../platform/apps/content-worker`.
- If a bug is card-specific, find the exact card definition and nearby similar
  cards before changing shared engine behavior.
- If a report is missing replay data or has malformed turns, preserve that as
  an evidence limit instead of guessing.

## Agent Backpressure Gates

Use the root `/backpressured` command for long-running Lorcana work. For
rules-facing work, load `lorcana-rules` before editing; for card reports, use
`replay-debugging`, `lorcana-find-card`, `lorcana-test-generation`, and
`lorcana-cards` as the staged gates.

- Replay or player report: replay evidence first, then card lookup, rules
  constraints, failing test, minimal fix, focused test rerun.
- Card behavior: sibling card test or focused engine primitive test before
  broad package checks.
- Simulator-visible bug: engine/card test plus browser-visible fixture or
  regression route proof.
- Platform integration: validate the Lorcana adapter or platform boundary that
  consumes the engine output before running broad CI.

If replay evidence is unavailable, record the replay id, turn, command, and
failure reason before proceeding from text-only evidence.

## Simulator Visual Regression Fixtures

Use `http://localhost:5174/tests/regressions` as the index for saved
player-reported simulator repros. A regression starts as one reusable fixture
under
`packages/lorcana/lorcana-simulator/src/lib/features/simulator-devtools/fixtures/regressions/`
and gets registered in that folder's `index.ts`; do not create parallel ad hoc
fixtures for the same board state.

Before adding a new fixture, search the regression registry and the index route
for an existing slug. Reuse or extend the existing fixture when the setup is
materially the same, then add only the missing assertion: engine assertions go
in `src/testing/regressions/` via `createRegressionTestEngine`, and browser
assertions go in `e2e/regressions/` using helpers exported from
`e2e/support/lorcana-test.ts` such as `buildRegressionFixturePath`,
`cardByName`, and `findCardIdByLabel`.

## Validation

- Use focused package tests first, especially direct `bun test` inside
  `lorcana-engine` when Vite+/Turbo wrappers fail before reaching the target.
- From this submodule: `vp check`, `vp test`, or `pnpm run ci-check`.
- From repo root: `bun run ci:lorcana:check`.
