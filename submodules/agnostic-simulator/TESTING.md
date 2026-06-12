# Agnostic Simulator Testing

This submodule owns shared cross-game contracts, adapter interfaces, simulator
contracts, shared simulator UI, agent-core behavior, and the multi-game
simulator shell.

## Test Layers

Package tests under `packages/*` cover protocol schemas, gateway envelopes,
game-page contracts, simulator contracts, simulator runtime helpers, shared
deck/card/display helpers, engine-core primitives, agent-core, simulator UI
animation helpers, and per-game adapter mappings.

App jsdom tests live in `apps/multi-game-simulator/src/**` and
`apps/multi-game-simulator/card-tests/**/*.integration.test.tsx`. They render
React with Testing Library and drive the simulator POM against a jsdom DOM
driver.

Playwright tests live in `apps/multi-game-simulator/e2e/specs/**/*.spec.ts`
and `apps/multi-game-simulator/card-tests/**/*.e2e.test.ts`. They run against
the dev simulator route and drive the same POM concepts through a real browser.

Cyberpunk card behavior currently uses a three-layer folder under
`apps/multi-game-simulator/card-tests/cyberpunk/<set>/<type>/<card-slug>/`:

- `unit.test.ts` for engine-only behavior.
- `integration.test.tsx` for jsdom simulator happy paths.
- `e2e.test.ts` for Playwright browser happy paths.
- Named variants such as `high-cred.integration.test.tsx` and
  `high-cred.e2e.test.ts` when a card-specific scenario deserves its own case.

## Boundaries

`packages/protocol` owns gateway/client/server message shapes, playable slugs,
interaction views, envelopes, and stream key helpers.

`packages/game-page-contract` owns live-match, replay, practice, gateway,
page-load, deck-codec, and diagnostic contracts.

`packages/simulator-contract` owns normalized simulator snapshots, tables,
zones, entities, layouts, and interactions.

`packages/shared/src/game-adapter` owns the slug-keyed adapter registry and
platform runtime adapter interfaces.

Per-game adapter packages under `packages/{cyberpunk,gundam,lorcana,one-piece}`
translate native engines into shared protocol/runtime contracts. Shared
packages should not import game engine/card details.

## Simulator Expectations

Playwright simulator specs must run against `vp dev`, not `vp preview`.
Cyberpunk `/cyberpunk/simulator/tests/*` routes and the
`window.__cyberpunkEngine` / `window.__cyberpunkSimulator` bridges are
dev-only.

Default fixture navigation should use `?ai=off`. Add
`&auto-advance-attack=off` when a test needs stable manual attack-flow
inspection.

Prefer POM actions and combined assertions. Specs should drive visible UI
actions, then assert both engine state and rendered DOM state when both exist.
For UI-driven moves, verify the dispatch spy with `expectLastDispatch(...)` so
tests catch UI-to-engine shape drift.

Use stable selectors and semantic attributes: `data-testid`, `data-side`,
`data-mode`, and animation attributes such as `data-transfer-kind`,
`data-from-zone-id`, and `data-to-zone-id`.

## jsdom Expectations

jsdom tests are for structure, semantic DOM hooks, prompts, runner-agnostic POM
behavior, and detailed interaction paths that do not need layout.

Cyberpunk jsdom fixture tests use `renderCyberpunkSimulatorScenario(...)` and
`createTestingLibraryCyberpunkSimulatorPom(...)`. Animation-using tests should
mock sound and call `ensureJsdomAnimationSupport()` before rendering when
needed.

Use Playwright instead of jsdom for real browser layout, drag/drop, viewport,
hover, animation proof, and routing behavior.

## Commands

From repo root:

```sh
bun run ci:agnostic:check
bun run ci:agnostic
```

From `submodules/agnostic-simulator`:

```sh
vp install
pnpm run check
pnpm run test
pnpm run ci-check
pnpm run ci-check-full
```

From `submodules/agnostic-simulator/apps/multi-game-simulator`:

```sh
pnpm test
vp test run
vp test run "src/games/cyberpunk/testing/fixtures/jsdom/*.test.tsx"
vp test run "card-tests/**/*.integration.test.tsx"
pnpm e2e:install
pnpm e2e
pnpm exec playwright test --project=chromium e2e/specs/root-fixtures-pom.spec.ts
pnpm exec playwright test --project=chromium <spec-or-card-test-path>
```

## Caveats

`pnpm run ci-check` and `bun run ci:agnostic:check` do not run Playwright e2e.
Run app-local e2e separately when browser behavior changes.

Playwright defaults to port `5193`; set `PLAYWRIGHT_PORT=<port>` when reusing
an existing dev server.

Older docs may mention `apps/simulator` or port `5173`; the current app path is
`apps/multi-game-simulator`, and the Playwright config defaults to `5193`.

Generated Playwright artifacts such as `playwright-report/` and `test-results/`
are disposable.
