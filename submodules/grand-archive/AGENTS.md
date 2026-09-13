# Grand Archive Submodule

This workspace owns Grand Archive's catalog, rules engine, cards, and game-specific tooling.

Before changing gameplay, card text, deckbuilding, prompts, or rules-facing tests, read
`.agents/skills/grand-archive-rules/SKILL.md` and the minimum relevant official rules pages.

## Canonical Identity

- Game title: Grand Archive
- Repository slug: `grand-archive`
- Package namespace: `@tcg/grand-archive-*`
- Official rules: `https://rules.gatcg.com/`
- Official card data: `https://api.gatcg.com/openapi.json`

## Architecture

- `packages/types` owns catalog and game-native static vocabulary types.
- `packages/cards` exposes generated catalog metadata and lookup indexes. It does not encode rules behavior.
- `tools/scraper` fetches provenance-preserving raw snapshots from the official Index API.
- `tools/catalog` validates and normalizes a raw snapshot into the generated cards catalog.
- `packages/engine` owns executable card behavior and authoritative game-state transitions. Never infer or execute rules directly from the Index's text fields.

## Current Scope

The engine is rules-driven. Do not introduce a generic or renamed Flesh and Blood primitive as a placeholder. Add or extend Grand Archive engine contracts only when an official rule or printed card needs them.

## Validation

Run the focused package check first. At task completion, run `pnpm run ci-check` from this directory.
