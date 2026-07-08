# Simulator E2E Harness

## TL;DR

Playwright + POM-based end-to-end tests for the Cyberpunk simulator. Every
action is driven through rendered UI controls, and assertions read visible DOM
state. Direct Cyberpunk engine state belongs in engine or jsdom integration
tests, not Playwright.

## Quickstart

```sh
pnpm e2e             # headless run
pnpm e2e:ui          # Playwright UI mode (recommended for debugging)
pnpm e2e:install     # install the chromium browser (one-time per machine)
```

The Playwright dev server boots `vp dev --port 5193` automatically (see
[../playwright.config.ts](../playwright.config.ts)). On macOS, browser
binaries are cached at `~/Library/Caches/ms-playwright`.

The harness must run against `vp dev`, never `vp preview`. The
`/cyberpunk/simulator/tests/*` fixture routes are development-only and should be
used only to render visible UI states.

## Architecture

```
e2e/
  poms/
    CyberpunkPlaywrightHarnessClient.ts  # Playwright factory + harness client
  specs/
    root-fixtures/                        # one behavior spec per root fixture scenario
    root-fixtures-pom.spec.ts             # structural smoke tests for every fixture
    two-turns.spec.ts                     # full SETUP → MULLIGAN → 4 half-turns flow
    retail-card-catalog.spec.ts           # static render of every official retail card
    main-routes.spec.ts                   # route / navigation smoke tests
    ...
  tsconfig.json                           # scoped to e2e/**/*.ts
```

This harness intentionally excludes animation, viewport, hover, and other
visual-only Playwright specs. Cover animation plan mapping, resolver behavior,
and rendered semantic state in unit or jsdom tests.

The entry point for every test is `createPlaywrightCyberpunkSimulatorPom`:

```ts
import { test, expect } from "@playwright/test";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("my flow", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, {
    fixture: { scenarioId: "openingMain" },
  });

  await pom.expectHandSize("p1", 3);
});
```

The factory:

1. Navigates to `/cyberpunk/simulator/tests/${scenarioId}?ai=off&auto-advance-attack=off`.
2. Builds a `CyberpunkSimulatorPom` backed by `PlaywrightDomDriver` and `PlaywrightCyberpunkHarnessClient`.
3. Waits for rendered board state and asserts the structural DOM.

## Action path: InteractionPanel only

`CyberpunkSimulatorPom` methods such as `mulligan`, `keepHand`, `passPhase`,
`playCardFromHand`, `attackRival`, `attackUnit`, `gainGig`, `resolveAttack`,
etc., all click elements inside the shared `InteractionPanel`. The underlying
`InteractionPanelPom` translates those clicks into:

- `data-move-command` selectors for the interaction card,
- `data-testid="interaction-candidate:${interactionId}:${entityId}"` for candidates,
- `data-testid="choice-chip:${optionId}"` for option chips,
- `data-testid="interaction-submit:${interactionId}"` for the submit button.

The engine bridge is not part of the Playwright contract. Do not use
`page.evaluate` to inspect Cyberpunk engine state, dispatch engine moves, or
read private setup data.

## Visible Assertions

The POM's `expect*` helpers should assert rendered DOM state through Playwright
auto-retrying matchers. If an assertion requires hidden cards, private prompts,
or raw engine fields, move it to `submodules/cyberpunk` engine tests or a jsdom
integration test.

## POM reference

All helpers live on `CyberpunkSimulatorPom`
([src/games/cyberpunk/testing/cyberpunk-simulator-pom.ts](../src/games/cyberpunk/testing/cyberpunk-simulator-pom.ts)).

### Navigation / factory

| Helper                                                                     | What it does                                            |
| -------------------------------------------------------------------------- | ------------------------------------------------------- |
| `createPlaywrightCyberpunkSimulatorPom(page, { fixture: { scenarioId } })` | Navigates to the fixture and returns a ready POM.       |
| `pom.waitForReady()`                                                       | Waits for the simulator bridge and the rendered board.  |
| `pom.takeControl(player)`                                                  | Flips the human seat to the side that maps to `player`. |
| `pom.getHumanSide()`                                                       | Reads the current human seat.                           |

### UI-driven moves

| Helper                                             | InteractionPanel move command |
| -------------------------------------------------- | ----------------------------- |
| `pom.mulligan(as)`                                 | `cyberpunk.mulligan`          |
| `pom.keepHand(as)`                                 | `cyberpunk.keepHand`          |
| `pom.passPhase(as)`                                | `cyberpunk.passPhase`         |
| `pom.gainGig(dieId, as)`                           | `cyberpunk.gainGig`           |
| `pom.playCardFromHand(cardOrRef, as)`              | `cyberpunk.playCard`          |
| `pom.attachGearFromHand(gearId, attachToId, as)`   | `cyberpunk.playCard`          |
| `pom.goSolo(cardOrRef, as)`                        | `cyberpunk.goSolo`            |
| `pom.callLegend(legendId, as)`                     | `cyberpunk.callLegend`        |
| `pom.attackRival(attackerId, as)`                  | `cyberpunk.attackRival`       |
| `pom.attackUnit(attackerId, defenderId, as)`       | `cyberpunk.attackUnit`        |
| `pom.useBlocker(blockerId, as)`                    | `cyberpunk.useBlocker`        |
| `pom.resolveAttack(as, { pass?, gigIdsToSteal? })` | `cyberpunk.resolveAttack`     |
| `pom.resolveStealGigs(dieIds, as)`                 | `cyberpunk.resolveStealGigs`  |

### Engine state reads (bridge-only)

`getPhase`, `getTurnNumber`, `getActivePlayerId`, `getOpponentOf(player)`,
`getCardsInZone(zone, player)`, `getHandSize(player)`, `getFieldSize(player)`,
`getFixerDiceCount(player)`, `getGigCount(player)`, `getGigDice(player)`,
`getEddies(player)`, `getAllowedGigDice(player)`, `pickFirstAllowedDie(player)`,
`getPendingChoiceType(player)`, `isGameOver()`.

### Combined engine + DOM assertions

| Helper                                  | Engine value                             | DOM hook                          |
| --------------------------------------- | ---------------------------------------- | --------------------------------- |
| `expectHandSize(player, n)`             | `getCardsInZone("hand")`                 | zone `data-count` + visible cards |
| `expectFieldSize(player, n)`            | `getCardsInZone("field")`                | zone `data-count` + field cards   |
| `expectFixerDiceCount(player, n)`       | `getFixerDice().length`                  | zone `data-count` + dice          |
| `expectGigCount(player, n)`             | `getGigCount()`                          | zone `data-count` + dice          |
| `expectEddies(player, n)`               | `getEddies()`                            | zone `data-count`                 |
| `expectTrashSize(player, n)`            | `getCardsInZone("trash").length`         | zone `data-count`                 |
| `expectFaceDownLegendsCount(player, n)` | `getCardsInZone("legendArea")` face-down | face-down legend slots            |
| `expectBoardMode(player, mode)`         | active player / prompt                   | board `data-mode`                 |

### Dispatch spy

| Helper                            | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `clearDispatchLog()`              | Reset the log between phases / actions.          |
| `getDispatchLog()`                | Read the recorded actions + results.             |
| `expectLastDispatch({ type, … })` | Deep-equality on every key in the latest action. |
| `expectDispatch({ type, … })`     | True if any action in the scoped log matches.    |

## `data-testid` conventions

The shared `InteractionPanel` exposes:

| Testid                                    | Meaning                           |
| ----------------------------------------- | --------------------------------- |
| `interaction-card:${id}`                  | A single move/interaction card    |
| `interaction-candidate:${id}:${entityId}` | Selectable candidate button       |
| `interaction-payment:${id}:${entityId}`   | Payment selection button          |
| `interaction-order:${id}:${entityId}`     | Ordering selection button         |
| `interaction-submit:${id}`                | Submit button for the interaction |
| `choice-chip:${optionId}`                 | Boolean / option chip             |

Board zones are selected via `data-zone-id` inside the active shell:

| Zone id                           | Purpose         |
| --------------------------------- | --------------- |
| `p-hand` / `opp-hand`             | Hand zone       |
| `p-field` / `opp-field`           | Field zone      |
| `p-legendArea` / `opp-legendArea` | Legends zone    |
| `p-fixer` / `opp-fixer`           | Fixer dice zone |
| `p-gigArea` / `opp-gigArea`       | Gig dice row    |
| `p-eddieArea` / `opp-eddieArea`   | Eddies zone     |
| `p-trash` / `opp-trash`           | Trash zone      |

Cards and dice inside zones carry `data-testid="card"` and `data-card-kind`.

## Determinism

Every scenario in [../src/engine/fixtures/scenarios.ts](../src/engine/fixtures/scenarios.ts)
pins its own seed via the `SCENARIO_SEEDS` map. `createMatchState` defaults
to a stable `"default"` seed (no `Date.now()`), so reloading the same fixture
produces identical state.

`createPlaywrightCyberpunkSimulatorPom` always passes `?ai=off` and
`auto-advance-attack=off` unless explicitly overridden — the default Board page
boots a greedy AI on the rival seat that would race the test driver and resolve
pending choices before assertions could run.

## Adding a new spec — checklist

1. Branch off `main`.
2. If the flow needs a new starting state, add a fixture entry to
   [../src/engine/fixtures/scenarios.ts](../src/engine/fixtures/scenarios.ts)
   and pin a seed in `SCENARIO_SEEDS`.
3. Create `e2e/specs/your-flow.spec.ts` and import from `@playwright/test`:
   ```ts
   import { test, expect } from "@playwright/test";
   import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
   ```
4. Use the factory inside your test:
   ```ts
   test("my flow", async ({ page }) => {
     const pom = await createPlaywrightCyberpunkSimulatorPom(page, {
       fixture: { scenarioId: "openingMain" },
     });
     // …
   });
   ```
5. Prefer `pom.expect*` over raw `getX` so engine and UI are asserted together.
6. Drive every action through the POM (`mulligan`, `playCardFromHand`, `attackRival`,
   etc.) and add `expectLastDispatch` to verify the action shape.
7. Run locally: `pnpm e2e specs/your-flow.spec.ts`.

## Debugging a failing spec

- **UI mode** — `pnpm e2e:ui` for a time-travel debugger with snapshots.
- **Headed run** — `pnpm exec playwright test --headed` to watch the browser.
- **Trace viewer** — `pnpm exec playwright show-trace test-results/.../trace.zip`.
  Traces are auto-captured `on-first-retry` per
  [../playwright.config.ts](../playwright.config.ts).
- **HTML report** — open `playwright-report/index.html` after a run.
- **CI failures** — the workflow uploads `playwright-report/` and
  `test-results/` artifacts on failure.

### Determinism debugging

Specs in this harness should not be flaky. If you observe flakiness, suspect:

- **AI raced you.** Confirm the spec used `createPlaywrightCyberpunkSimulatorPom`
  without an `{ ai: "greedy" }` override — the default is `?ai=off`.
- **Stale render.** `expect*` helpers assert the DOM through Playwright's
  auto-retrying matchers. A bare `await pom.getHandSize(p)` returns the latest
  engine snapshot with no retry — if you need to wait for a UI update, assert
  via `expect*`.
- **Different seed.** If you pulled a new fixture into `SCENARIO_SEEDS`, earlier
  hand contents may shift — pin the seed to a value that gives you the cards you
  need rather than asserting on whichever cards happened to draw last time.
