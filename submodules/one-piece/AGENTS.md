# One Piece

Owns rules, engine, cards, types, and parser tooling. Use the slug `one-piece`.
For rules-facing work, use `.agents/skills/op-rules/SKILL.md`.

- `packages/engine/src`: moves, phases, battle, DON, prompts, and tests.
- `packages/cards/src`, `packages/types/src`, `packages/utils/src`: card data,
  native types, and helpers.
- `tools/op-card-parser`: import and parser tooling.
- `../agnostic-simulator/packages/one-piece`: runtime adapter and agent.
- Browser UI: `../agnostic-simulator/apps/multi-game-simulator/src/games/one-piece`.

Verify card behavior through play, attack, activate, and prompt commands.
Printed text or a data-shape assertion alone does not prove implementation.
Use the local bug-triage and test-generation skills for those tasks.
