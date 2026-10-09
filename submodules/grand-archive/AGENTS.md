# Grand Archive

Owns the catalog, engine, and game tooling. For rules-facing work, use
`.agents/skills/grand-archive-rules/SKILL.md`.

- `packages/types`: catalog and game-native types.
- `packages/cards`: generated printed metadata and lookup indexes.
- `tools/scraper`: raw snapshots from the official Index API.
- `tools/catalog`: snapshot validation and catalog generation.
- `packages/engine`: executable card behavior and state transitions.

Keep catalog text separate from executable rules. Base engine behavior on
Grand Archive rules and cards, not assumptions from another game's engine.
Official sources: `https://rules.gatcg.com/` and
`https://api.gatcg.com/openapi.json`.
