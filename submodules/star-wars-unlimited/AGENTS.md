# Star Wars Unlimited

Owns rules, engine, typed cards, and import tools. For rules-facing work, use
`.agents/skills/swu-rules/SKILL.md` and its relevant references.

- `packages/engine/src`: state, commands, targets, effects, and projections.
- `packages/cards/src/cards`: card definitions and printed metadata.
- `packages/cards/src/helpers`: game-native authoring helpers.
- `packages/types` and `packages/utils`: native types and utilities.
- `tools/import-card-data`: official metadata import.

Trace card bugs from the definition to `effects.ts` or `targets.ts`; legality
lives in `commands.ts` and `state.ts`. Shared runtime and simulator integration
belongs in `../agnostic-simulator` adapters.
