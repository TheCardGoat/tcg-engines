# Gundam

Owns the engine, declarative cards, adapter, and bot tools. For rules-facing
work, use `.agents/skills/gundam-tcg-rules/SKILL.md`. Local `gundam-cards`,
`gundam-test-generation`, and `gundam-bot-bench` skills cover those tasks.

- `packages/engine/src`: state, moves, combat, and effects.
- `packages/cards/src`: declarative definitions, without engine runtime imports.
- `packages/types` and `packages/token-data`: shared leaf packages.
- `packages/server-adapter`: runtime integration; `tools/bot-bench`: bot evaluation.
- Browser UI: `../agnostic-simulator/apps/multi-game-simulator/src/games/gundam`.
- Architecture and invariants: `docs/architecture.md` and
  `docs/design-docs/core-beliefs.md`.

The supported format is the standard two-player game. Multiplayer is outside
scope unless requested. Preserve the printed owner of each choice.

Keep dependencies one-way from types/token data to cards/engine to adapters
and UI. Use injected clocks for deterministic match logic and `GameLogger`
for match-side-effect logs.
