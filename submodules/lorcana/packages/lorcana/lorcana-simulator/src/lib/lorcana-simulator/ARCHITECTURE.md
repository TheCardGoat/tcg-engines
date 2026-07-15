# Lorcana Simulator Architecture (V3)

## Core principles

- Rules engine is the source of truth.
- `LorcanaTabletopSimulator` is production UI only.
- Engine orchestration/debug tooling stays outside the production component.
- The simulator renders from projected snapshots and validates/executes moves through injected read/action contracts.

## Production boundary

`LorcanaTabletopSimulator` consumes separate simulator collaborators:

- `LorcanaSimulatorReadModel`
- `getStateID()`
- `getSnapshot(view)`
- `getOwnerSide(view)`
- `getMoveLog(limit?)`
- `LorcanaSimulatorPlayerActions`
- `validateMove(view, moveId, params)`
- `executeMove(view, moveId, params)`

The UI does not instantiate engines, does not mutate board state through the read model, and does not expose judge/debug mutations.

## Testing/story boundary

`LorcanaMultiplayerSimulatorAdapter` (in `testing/`) wraps `LorcanaMultiplayerTestEngine` and owns:

- Board projection and masking
- Move log formatting for external tooling
- Read-model construction for simulator sessions

Storybook/test harnesses create simulator sessions, then pass `{ readModel, playerActions, view }` into `LorcanaTabletopSimulator`.

## UI shell

`LorcanaTabletopSimulator` sidebar is production-hardened:

- Header: opponent (or Player Two) info
- Footer: player (or Player One) info
- No built-in fixture/debug/view/activity/notes panels

Gameplay interactions (selection/challenge/drop/shortcuts) remain rules-validated through the injected engine.

Ownership and gameplay state are intentionally separate:

- `getOwnerSide(view)` determines perspective and which seat renders at the bottom.
- `boardSnapshot.activeSide` remains the live gameplay/priority side.
