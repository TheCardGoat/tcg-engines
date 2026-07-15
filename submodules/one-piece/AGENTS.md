# One Piece Submodule

This submodule owns the One Piece engine, cards, types, utilities, parser, and
rules. Browser gameplay lives in
`../agnostic-simulator/apps/multi-game-simulator/src/games/one-piece` and is
mounted at `https://tcg.online/one-piece/simulator`.

The canonical slug is `one-piece` across platform, protocol, and runtime code.

Before rules-facing work, read
`.agents/skills/op-rules/references/glossary.md`, then
`.agents/skills/op-rules/SKILL.md`. Keep native rules and wording in this
submodule; expose shared behavior through agnostic contracts and adapters.

## Where To Look

- `packages/engine/src` - moves, phases, battle, DON, prompts, and tests.
- `packages/cards/src` - definitions and generated card data.
- `packages/types/src` - card and game types.
- `packages/utils/src` - shared One Piece helpers.
- `tools/op-card-parser` - card data import/parser tooling.
- `../agnostic-simulator/packages/one-piece` - runtime adapter and agent.

## Focused Evidence

- Card behavior: drive real play, attack, activate, and prompt commands through
  interaction-style engine tests.
- Engine legality: focused engine test before package or workspace checks.
- Browser interaction: focused multi-game simulator test plus route proof.
- Production route issue: inspect the platform reverse proxy before changing
  game code.

A single-card change is not complete until the behavior executes through the
test harness; card text or data shape alone is insufficient.

Run focused package tests, `vp check`, or `vp test` in this workspace; use
`pnpm run ci:one-piece:check` from the root after they pass.
