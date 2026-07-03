# Star Wars Unlimited Submodule

This submodule is the native Star Wars Unlimited implementation. It owns the
game engine, typed card definitions, shared types, import/parser tooling, rules
references, and future platform/server adapters.

Before rules-facing work, read
`.agents/skills/swu-rules/references/glossary.md` and keep the relevant game
terms in context. For exact citations, use `.agents/skills/swu-rules/SKILL.md`
and load only the matching progressive-disclosure reference files.

Platform runtime or shared simulator exposure should map Star Wars Unlimited
concepts through `../agnostic-simulator` contracts/adapters. Keep Star Wars
Unlimited rules, cards, engine semantics, and glossary-native wording inside
this submodule.

## Where To Look

- `packages/engine/src` - Star Wars Unlimited runtime state, commands, target
  resolution, effect execution, projections, and move-log handling.
- `packages/cards/src/cards` - typed Star Wars Unlimited card definitions and
  printed metadata.
- `packages/cards/src/helpers` - SWU-native authoring helpers for abilities,
  effects, and targets.
- `packages/types/src` - shared Star Wars Unlimited package types.
- `packages/utils/src` - shared package utilities.
- `.agents/skills/swu-rules` - official Comprehensive Rules v2.0 extraction,
  glossary, topic indexes, and citation workflow.
- `tools/import-card-data` - official card metadata import tooling.

## Bug Triage

- Card behavior bugs start in `packages/cards/src/cards`, then trace through
  the interpreter in `packages/engine/src/effects.ts` and
  `packages/engine/src/targets.ts`.
- Engine legality bugs start in `packages/engine/src/commands.ts` and the
  state model in `packages/engine/src/state.ts`.
- Platform or simulator exposure should be added through
  `../agnostic-simulator` adapters after the engine package boundary is stable.

## Validation

- From this submodule: `vp check`, `vp test`, focused package checks, or
  `pnpm run ci-check`.
- Package-focused checks: `vp run check-types` in `packages/types`,
  `packages/cards`, and `packages/engine` when touching those packages.
- From repo root: `bun run ci:star-wars-unlimited:check`.
- For docs-only `AGENTS.md` or `.agents/skills` edits, `git diff --check` plus
  the skill validator is sufficient unless code was also changed.
