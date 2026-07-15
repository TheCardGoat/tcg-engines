# Gundam Testing

Gundam owns Gundam-native rules, cards, engine behavior, simulator behavior,
server adapter behavior, architecture docs, and bot tooling.

## Test Boundaries

Engine behavior belongs in `packages/engine/src`. These tests cover shared
rules and runtime contracts: moves, lifecycle, combat, effect execution, target
legality, logs, clocks, automation, deck parsing, command protocol, and the
`GundamTestEngine` harness. Engine tests should use mock cards and focused
fixtures when proving reusable runtime behavior.

Card behavior belongs beside the card:

```text
packages/cards/src/cards/<set>/<type>/<card>.test.ts
```

Any card with non-empty `effects` or `keywordEffects` should have a sibling
non-empty test. A good card test creates a `GundamTestEngine` fixture, performs
the printed action, and asserts meaningful final state. It may also assert card
data shape or a card-specific condition miss, but broad rule combinatorics
belong in engine tests.

Edge cases belong at the shared layer they exercise. If a card exposes an
engine gap, add or update a focused engine test, then keep the card test as the
happy-path executable spec. UI-only edge cases belong in simulator tests.
Cross-boundary adapter behavior lives under
`../agnostic-simulator/packages/gundam/gundam-server-adapter`.

## Simulator Tests

Use RTL/jsdom tests in `apps/simulator/src/__tests__` for ordinary app flows and
DOM behavior. Component, selector, sample deck, live adapter, and route-loader
tests live near their source files under `apps/simulator/src` and
`apps/simulator/app`.

Use Playwright only when jsdom cannot prove the behavior: real layout,
viewport/mobile branches, hover, pointer/touch behavior, hydration, or a long
multi-phase browser flow that is clearer end-to-end. Playwright specs live in
`apps/simulator/e2e` and run against the production SSR build.

## Commands

From repo root:

```sh
bun run ci:gundam:check
bun run ci:gundam
```

From `submodules/gundam`:

```sh
vp install
pnpm run test
pnpm run check:harness
pnpm run ci-check
pnpm run ci-check-full
```

Focused package checks:

```sh
pnpm -F @tcg/gundam-engine test
pnpm -F @tcg/gundam-cards test
pnpm -F @tcg/gundam-simulator test
pnpm -F @tcg/gundam-simulator run build
pnpm -F @tcg/gundam-simulator exec playwright install --with-deps chromium
pnpm -F @tcg/gundam-simulator test:e2e
```

Harness checks:

```sh
pnpm run check:invariants
pnpm run check:card-fixtures
pnpm run check:doc-drift
```

## Caveats

`vp test` excludes `e2e/**`; Playwright must be run separately.

`ci-check-full` runs format, lint, Turbo tests, and build, but does not by
itself run the harness checks or Playwright e2e in every integration path. Run
`pnpm run check:harness` for card-fixture, boundary, or docs changes, and run
Playwright for browser-only simulator behavior.

Card fixture enforcement is a floor, not proof of full behavior coverage. It
catches missing or empty sibling tests, but it cannot tell whether assertions
are strong enough. The allowlist in `tools/harness/card-fixture-allowlist.txt`
is explicit test debt.

Before rules-facing work, read `.agents/skills/gundam-tcg-rules.md`.
