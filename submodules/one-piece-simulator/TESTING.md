# One Piece Testing

This submodule is a copied One Piece simulator snapshot with engine, cards,
types, utils, tooling, and a browser simulator.

## Test Boundaries

Engine behavior is centered in `packages/engine/tests/index.test.ts` and
`packages/engine/tests/test-engine.test.ts`. These tests cover match creation,
projection, mulligan/start, legal commands, patches, prompts, attack/counter
flow, triggers, replay determinism, unsupported capability issues, and
invariant failures.

Test fixtures and command helpers live in `packages/engine/src/testing`.
Card and engine tests should drive real commands through `OnePieceTestEngine`
instead of mutating state directly, except for fixture and invariant tests.

Parser and import edge cases belong in `tools/op-card-parser/tests`, not in
engine happy paths. Catalog/type utility checks live in `packages/cards/tests`,
`packages/types/tests`, and `packages/utils/tests`.

## Card Tests

Generated per-card tests live under:

```text
packages/engine/src/cards/**/*.test.ts
```

The desired direction is one executable happy-path behavior test per card
ability, using `OnePieceTestEngine` and real commands. Broad edge cases should
move to the reusable engine module that owns the behavior: targeting, prompt
projection, attack/counter flow, trigger resolution, cost/payment, DON!!, or
zone movement.

Current caveat: many generated card tests only call `validateCardAbility(card)`
and are not included by the default engine `vp test run` include list. Treat
this as coverage inventory, not proof that printed behavior is exercised.

## Simulator Tests

`apps/simulator/example.spec.ts` is a Vitest adapter test, not Playwright. It
verifies local and remote engine adapter contracts.

The required simulator strategy is:

- jsdom tests for detailed DOM manipulation, app boot, command buttons,
  prompts, and UI-to-engine adapter behavior.
- Playwright tests for a browser happy path that starts the simulator and
  drives a visible user flow.

Current gap: no jsdom/testing-library DOM suite is present, and no effective
Playwright suite is discoverable. `playwright.config.ts` points at a stale
`./apps/op-simulator` path while the actual app is `apps/simulator`, and no
package script currently runs Playwright. Fix that before claiming browser
happy-path coverage for One Piece.

## Commands

From repo root:

```sh
bun run ci:one-piece:check
bun run ci:one-piece
```

From `submodules/one-piece-simulator`:

```sh
vp install
pnpm run ci-check
pnpm run ci-check-full
vp run ci:check
vp run ci:full
```

Focused package examples:

```sh
vp run @tcg/op-engine#test
vp run @tcg/op-simulator#test
vp run @tcg/op-card-parser#test
```

Or from a package directory:

```sh
vp test run
```

## Caveats

The One Piece runtime uses `one-piece`; some platform web content/deck code
still uses `onepiece`. Check the layer before changing slugs.

Per-card generated tests and card coverage inventory are not currently enough
to prove printed card behavior. Treat executable engine-command happy paths as
the required standard for new card work.

Before rules-facing work, read `.agents/skills/op-rules/comprehensive-rules.md`.
