# Lorcana Submodule

This submodule owns Lorcana cards, engine behavior, the legacy simulator,
server adapters, replay tooling, and Lorcana-specific agent skills.

Before rules-facing work, load
`.agents/skills/lorcana-rules/references/glossary.md` and then
`.agents/skills/lorcana-rules/SKILL.md`. For card work, also use the local
`lorcana-find-card`, `lorcana-cards`, and `lorcana-test-generation` skills.

## Ownership

- `packages/lorcana/lorcana-engine/src` - engine moves, resolutions, effects,
  prompts, automation, and tests.
- `packages/lorcana/lorcana-cards/src` - card definitions and generated exports.
- `packages/lorcana/lorcana-types/src` - shared Lorcana types.
- `packages/lorcana/lorcana-simulator/src` - Svelte simulator, devtools,
  fixtures, and local player flows.
- `packages/lorcana/lorcana-server-adapter/src` - platform runtime adapter.
- `packages/tools/replay-cli/src` - replay download and inspection tooling.

Shared platform and multi-game simulator exposure belongs in sibling
workspaces. Map Lorcana concepts through `../agnostic-simulator` contracts;
keep Lorcana rules and engine semantics here.

## Triage

- Start player reports from the exact replay/game id and turn when available.
- Use `replay-debugging` for production evidence before changing behavior.
- For card-specific reports, locate the exact definition and similar cards
  before changing shared engine primitives.
- Treat unavailable or malformed replay data as an evidence limit; do not infer
  missing events.
- For simulator repros, reuse the registry at
  `packages/lorcana/lorcana-simulator/src/lib/features/simulator-devtools/fixtures/regressions/`
  and its `/tests/regressions` route instead of creating parallel fixtures.

## Validation

Run the narrow card, engine, adapter, or simulator check first. From this
workspace use `vp check`, `vp test`, or `pnpm run ci-check` as appropriate.
From the integration root use `bun run ci:lorcana:check`.
