# Lorcana Simulator E2E

Run the Playwright suite from the simulator package root:

```sh
bun run test:e2e
```

For local development, prefer the `tsx`-backed launcher so Playwright can traverse raw
workspace TypeScript packages without rebuilding them first:

```sh
bun run test:e2e:dev
```

That command uses [`playwright.config.ts`](packages/lorcana/lorcana-simulator/playwright.config.ts), which:
- starts the local app with `bun run dev -- --host 127.0.0.1 --port 4173`
- points Playwright at `http://127.0.0.1:4173`
- only picks up files matching `**/*.e2e.ts` inside [`e2e/`](packages/lorcana/lorcana-simulator/e2e)

Practical consequences:
- `e2e/pre-game.e2e.ts` runs
- `e2e/targetting/multi-target-effects.e2e.ts` runs
- `e2e/seed.spec.ts` does not run because `.spec.ts` does not match the configured pattern

Run a single test file with:

```sh
bun run test:e2e:dev e2e/pre-game.e2e.ts
```

Run headed mode with:

```sh
bun run test:e2e:dev --headed
```

The support layer lives in [`e2e/support/`](packages/lorcana/lorcana-simulator/e2e/support):
- [`lorcana-test.ts`](packages/lorcana/lorcana-simulator/e2e/support/lorcana-test.ts) exports `test`, `expect`, `PLAYER_ONE`, `PLAYER_TWO`, and the POM
- [`lorcana-simulator-pom.ts`](packages/lorcana/lorcana-simulator/e2e/support/lorcana-simulator-pom.ts) wraps the simulator harness

Fixture usage in `pom.goto(...)`:

```ts
await pom.goto({ fixtureId: "pre-game", view: "playerOne" });
```

```ts
await pom.goto({ fixture: preGameFixture, view: "playerOne" });
```

```ts
await pom.goto({
  fixture: {
    playerOne: {
      play: [moanaDeterminedExplorer],
    },
    playerTwo: {
      play: [
        hiddenCoveTranquilHaven,
        {
          card: agustinMadrigalClumsyDad,
          atLocation: hiddenCoveTranquilHaven,
          exerted: true,
        },
      ],
    },
    skipPreGame: true,
  },
  view: "playerOne",
});
```

If Playwright reports `No tests found`, check these first:
- you are in [`packages/lorcana/lorcana-simulator`](packages/lorcana/lorcana-simulator)
- the file name ends with `.e2e.ts`
- the support imports resolve from `e2e/support/*.ts`

If Playwright fails while loading raw workspace `.ts` packages, use `bun run test:e2e:dev`
instead of plain `bunx playwright test`.
