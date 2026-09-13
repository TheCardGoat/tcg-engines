# Gundam production undo

## Goal

Provide a Lorcana-style, server-authoritative Gundam undo: the client requests
an undo at a specific version, the server validates and persists it, and all
subsequent projections expose the server-computed capability.

## Completed work

1. Restored states receive a strictly newer state ID and an undo history
   transition.
2. Gundam runtime undo checkpoints are persisted in server snapshots.
3. The shared `undo` move routes through the Gundam server adapter; join,
   sync, bootstrap, and accepted moves publish per-player availability.
4. The live simulator submits only the versioned gateway command.
5. Focused engine, adapter, and live-client tests cover the path.

## Validation

- `pnpm --dir submodules/gundam/packages/engine test -- per-player-undo.test.ts`
- `pnpm --dir submodules/gundam/packages/engine run check`
- `pnpm --dir submodules/agnostic-simulator/packages/gundam/gundam-server-adapter test -- gundam-server-engine.test.ts`
- `pnpm --dir submodules/agnostic-simulator/packages/gundam/gundam-server-adapter run typecheck`
- `pnpm --dir submodules/agnostic-simulator/apps/multi-game-simulator exec vp test run --configLoader runner src/games/gundam/src/engine/live/remoteAdapter.test.ts src/games/gundam/src/engine/live/liveMessages.test.ts`

Broader agnostic/platform typechecks remain blocked by unrelated cross-game
workspace type failures and missing linked module dependencies.
