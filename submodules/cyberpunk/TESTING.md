# Cyberpunk Testing

Cyberpunk owns Cyberpunk-native rules, cards, engine behavior, parser/scraper
tooling, and the server adapter. The migrated Cyberpunk simulator is tested in
`../agnostic-simulator/apps/multi-game-simulator`.

## Test Owners

Engine, card data, parser, scraper, and runtime tests live in
`submodules/cyberpunk`.

Browser and jsdom simulator tests for Cyberpunk live in
`submodules/agnostic-simulator/apps/multi-game-simulator`.

This split is intentional. Do not create a new Cyberpunk simulator test layer
under `submodules/cyberpunk/apps/simulator`.

## Engine Boundaries

Use `packages/engine/tests/**` and colocated `packages/engine/src/**/*.test.ts`
for rules, legality, prompts, move results, state transitions, active effects,
win conditions, automation, RNG, logs, and transport.

Shared engine edge cases belong in the module that owns the behavior:

- `effects` and active effect cleanup
- target resolution and pending choices
- move legality and move logs
- rule modifiers
- win conditions
- automation strategies and choice resolvers
- transport/local-engine behavior

These tests should not render the simulator.

## Card Tests

`packages/cards/tests/**` covers card data authoring guards: invariants, DSL
shape, effect corpus, derived keyword/timing consistency, bound id references,
and exports. Those tests are not gameplay proof.

Per-card happy-path behavior currently lives under:

```text
../agnostic-simulator/apps/multi-game-simulator/card-tests/cyberpunk/<set>/<type>/<card-slug>/
```

Expected layers:

- `unit.test.ts` for engine-only card behavior.
- `integration.test.tsx` for jsdom simulator POM behavior.
- `e2e.test.ts` for Playwright browser happy paths.
- Named variants such as `high-cred`, `low-cred`, `no-targets`, or
  `empty-field` when a card-specific case deserves its own jsdom/e2e pair.

Do not treat file presence as enough. Card tests must assert meaningful state
or visible behavior. Non-card-specific edge cases belong in shared engine
module suites.

## Simulator jsdom

Root fixture jsdom tests live at:

```text
../agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk/testing/fixtures/jsdom/
```

They render deterministic scenarios with `renderCyberpunkSimulatorScenario`,
drive them through `CyberpunkSimulatorPom`, and should keep the action sequence
visible in each test. Call `ensureJsdomAnimationSupport()` for animated UI and
unmount rendered views in `finally`. Mock sound when animation or audio
side effects would otherwise leak into the DOM test.

## Simulator Playwright

Browser tests live at:

```text
../agnostic-simulator/apps/multi-game-simulator/e2e/specs/**
../agnostic-simulator/apps/multi-game-simulator/card-tests/**/*.e2e.test.ts
```

Playwright runs against `vp dev`, never `vp preview`, because
`/cyberpunk/simulator/tests/*` and the `window.__cyberpunkEngine` bridge are
dev-only. Prefer POM helpers and engine-plus-DOM assertions. Use `?ai=off` and
`?auto-advance-attack=off` when deterministic manual flow is required.

## Commands

From repo root:

```sh
bun run ci:cyberpunk:check
bun run ci:agnostic:check
bun run dev:cyberpunk
```

From `submodules/cyberpunk`:

```sh
vp install
vp check
vp test
vp test run packages/engine/tests/<file>.test.ts
pnpm run ci-check
pnpm run ci-check-full
```

From `submodules/agnostic-simulator/apps/multi-game-simulator`:

```sh
pnpm test
vp test run src/games/cyberpunk/testing/fixtures/jsdom/<file>.test.tsx
pnpm e2e
pnpm exec playwright test --project=chromium e2e/specs/root-fixtures
pnpm exec playwright test --project=chromium card-tests/cyberpunk/<path>/e2e.test.ts
```

## Caveats

Some older docs/config may still reference `apps/simulator` or
`packages/engine/src/cards/**`; this checkout uses the multi-game simulator for
Cyberpunk browser tests and keeps card definitions under `packages/cards/src`.

Before rules-facing work, load `.agents/skills/cyberpunk-tcg-rules/SKILL.md`.
