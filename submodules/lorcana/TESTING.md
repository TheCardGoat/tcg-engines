# Lorcana Testing

Lorcana owns Lorcana-native rules, cards, engine behavior, simulator behavior,
server adapter behavior, replay tooling, and Lorcana-specific test skills.

## Test Boundaries

`packages/lorcana/lorcana-engine` owns isolated engine behavior: effect
resolvers, condition variants, target variants, runtime moves, automation,
projection, transport, runtime APIs, and core rules. Engine tests should not
depend on card package behavior when a mock or focused fixture is enough.

Important engine module coverage lives under:

- `packages/lorcana/lorcana-engine/src/runtime-moves/resolution/action-effects/__tests__/`
- `packages/lorcana/lorcana-engine/src/rules/conditions/__tests__/`
- `packages/lorcana/lorcana-engine/src/targeting/variants/__tests__/`
- `packages/lorcana/lorcana-engine/src/runtime-moves/moves/**`
- `packages/lorcana/lorcana-engine/src/core/runtime/**`

Resolver, condition, and target-variant directories use coverage inventory
tests such as `_coverage.test.ts`. Add a focused module test when adding a new
variant; do not rely on a card happy-path test to prove the reusable primitive.

`packages/lorcana/lorcana-cards` owns card definitions, generated data, and
card behavior tests beside the definitions:
`src/cards/<set>/<type>/<number>-<slug>.test.ts`.

`packages/lorcana/lorcana-simulator` owns Svelte simulator UI, browser
fixtures, jsdom POM tests, and Playwright e2e.

## Card Tests

Card tests should cover the happy path for each printed behavior and specific
regressions for that card. Use the current multiplayer test engine for
gameplay behavior. Use narrow property assertions only for card data shape or
keyword/model checks.

Good card tests drive active behavior through game commands, assert meaningful
state, and keep one printed behavior clause readable. Empty tests, keyword-only
smoke tests, and assertions that only check missing implementation flags are not
real coverage.

Broader edge cases belong to the owning module: targeting variants,
conditions, effect resolvers, under-card handling, hidden-zone behavior,
chooser behavior, and runtime move semantics.

## Simulator Tests

Playwright e2e lives under `packages/lorcana/lorcana-simulator/e2e` and uses
`playwright.config.ts`. Files must match `**/*.e2e.ts`.

jsdom simulator tests live under `packages/lorcana/lorcana-simulator/src/testing`
and `packages/lorcana/lorcana-simulator/vitest`. Use these for detailed POM,
DOM, prompt, and interaction assertions that do not need a real browser.

For player-reported visual/browser regressions, prefer one reusable fixture in
`src/lib/features/simulator-devtools/fixtures/regressions`, engine assertions
in `src/testing/regressions`, and browser assertions in `e2e/regressions`.

## Skills

Use the local Lorcana skills before rules-facing work:

- `.agents/skills/lorcana-rules/SKILL.md`
- `.agents/skills/lorcana-find-card/SKILL.md`
- `.agents/skills/lorcana-test-generation/SKILL.md`
- `.agents/skills/lorcana-cards/SKILL.md`
- `.agents/skills/replay-debugging/SKILL.md` for replay-backed reports

## Commands

From repo root:

```sh
bun run ci:lorcana:check
bun run ci:lorcana
```

From `submodules/lorcana`:

```sh
vp install
pnpm run test
pnpm run check
pnpm run ci-check
pnpm run ci-check-full
```

Focused card examples:

```sh
cd submodules/lorcana/packages/lorcana/lorcana-cards
bun test "./src/cards/<set>/<type>/<number>-<slug>.test.ts"
bun run check-types
```

Focused engine examples:

```sh
cd submodules/lorcana/packages/lorcana/lorcana-engine
bun test src/runtime-moves/resolution/action-effects/__tests__/<type>.test.ts
bun test src/rules/conditions/__tests__/<type>.test.ts
bun test src/targeting/variants/__tests__/<type>.test.ts
```

Simulator examples:

```sh
cd submodules/lorcana/packages/lorcana/lorcana-simulator
bun run test
bun run test:simulator-jsdom
bun run test:e2e:dev
bun run test:e2e:dev e2e/pre-game/pre-game.e2e.ts
```

## Caveats

`vp test` excludes `e2e/**`; run Playwright separately for browser-visible
simulator behavior.

If Playwright reports no tests found, check that the working directory is
`packages/lorcana/lorcana-simulator`, the file ends with `.e2e.ts`, and support
imports resolve from `e2e/support`.

`bun run test:e2e:dev` is preferred locally when raw workspace TypeScript
package loading is involved.
