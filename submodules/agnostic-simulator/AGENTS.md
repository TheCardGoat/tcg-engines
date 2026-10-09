# Agnostic Simulator

Owns cross-game contracts, adapters, shared UI, agents, and the multi-game app.

## Main paths

- `packages/protocol`: wire protocol, game slugs, and gateway envelopes.
- `packages/shared/src/game-adapter`: adapter interfaces and registry.
- `packages/game-page-contract`: match, replay, practice, and page-load contracts.
- `packages/simulator-contract`: normalized browser state and interactions.
- `packages/simulator-ui`: shared UI; `packages/agent-core`: shared agent runner.
- `packages/<game>`: game-specific adapters and agents.
- `apps/multi-game-simulator`: browser app and game surfaces.

## Local guidance

- Keep game engines and cards out of shared packages. Put game-specific state,
  labels, prompts, and behavior in the game adapter or game UI.
- When a shared contract changes, update affected adapters and verify their
  mappings. Check that the model fits the supported games.
- Reuse Mantine and `@tcg/simulator-ui`. Follow root `DESIGN.md` for density
  and shared surface styles; keep the board prominent and touch targets usable.
- Use workspace scripts for focused checks. The optional broad root check is
  `pnpm run ci:agnostic:check`.

## Run and validate

- For package logic, adapters, and contracts, run focused tests from the owning
  package. Check affected consumers when shared types or mappings change.
- For UI work, run only this simulator: `pnpm run dev:multi-game-sim` from the
  repository root, or `pnpm run dev` from this workspace. The default address
  is `http://127.0.0.1:5193`; reuse a suitable existing server first.
- Open local practice or the relevant `/component-catalog`,
  `/simulator-ui-fixtures`, `/animation-fixtures`, or game test route directly.
  Extend existing fixtures when needed. Exercise interactions in local practice
  when static fixtures cannot verify the behavior.
- For Alpha Clash or Grand Archive opening visuals, use the same simulator
  server and open `/simulator-ui-fixtures` or `/animation-fixtures` to select
  the opening preview. See [opening fixtures](docs/opening-visual-fixtures.md).
- Simulator visuals and local interactions do not require platform services.
  Use platform integration only for changed hosted transport, auth, persistence,
  or routing behavior that local tests cannot cover. A fixture that displays
  hosted controls proves their presentation, not a hosted match.
