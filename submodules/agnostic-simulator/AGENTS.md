# Agnostic Simulator

This submodule owns TCG Online's cross-game contracts, protocol, adapter
interfaces, shared simulator UI, agent core, and multi-game browser app.

Keep shared models game-agnostic. If a behavior applies to one game, keep it in
that game or its adapter. Shared concepts use the smallest cross-game shape and
let adapters provide native ids, labels, zones, prompts, and state.

## Where To Look

- `packages/protocol/src` - runtime protocol, game slugs, gateway envelopes,
  interactions, and Redis stream keys.
- `packages/shared/src/game-adapter` - adapter interfaces and the slug-keyed
  registry consumed by platform services.
- `packages/game-page-contract/src` - live match, replay, practice, gateway,
  and page-load contracts.
- `packages/simulator-contract/src` - normalized browser entities, zones,
  layouts, and interactions.
- `packages/simulator-ui/src` - reusable cross-game UI primitives.
- `packages/agent-core/src` - shared bot/agent runner behavior.
- `packages/<game>/<game>-server-adapter/src` - engine-to-platform adapters.
- `packages/<game>/<game>-agent/src` - game agents built on `agent-core`.
- `apps/multi-game-simulator/src` - Cyberpunk, Gundam, and One Piece browser
  surfaces plus shared app integration.

## Implementation Rules

- Do not import game engines or cards into protocol, page contracts, simulator
  contracts, simulator UI, shared adapters, or agent core.
- Before adding a shared concept, map it against Lorcana, Cyberpunk, Gundam,
  and One Piece. Narrow the shape when any game cannot map cleanly.
- Platform consumes `@tcg/protocol`, `@tcg/game-page-contract`, and
  `@tcg/shared/game-adapter` rather than game internals.
- Shared UI renders normalized data; game naming, layout, move labels, and
  prompt wording are adapter inputs.

## Cross-Game Change Gate

1. Update the contract in its owning package.
2. Update every affected game adapter.
3. Cover the shared contract and at least one focused adapter mapping.
4. For UI behavior, add focused component or route proof.
5. After focused checks pass, run `pnpm run ci:agnostic:check` from the root.

Do not claim a shared concept is complete while an affected game needs
game-native nouns in shared types.

## Bug Triage

- Protocol or gateway shape failures start in `packages/protocol/src`.
- A game that works locally but fails through platform runtime usually crosses
  its server adapter and engine package.
- Fix interaction or prompt rendering in shared UI only when the behavior is
  genuinely cross-game; otherwise fix the game's projection.

Run `vp check`, `vp test`, or the focused package script from this workspace
before the root agnostic gate.
