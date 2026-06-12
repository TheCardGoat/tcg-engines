# Simulator E2E Harness

## TL;DR

Playwright + POM-based end-to-end tests for the simulator. One spec per move
or flow. Each assertion checks **both** the engine state (via a dev-only
`window.__cyberpunkEngine` bridge) AND the rendered UI (via `data-testid`
locators). Specs talk to a `SimulatorPage` POM — they never call
`page.evaluate` directly.

## Quickstart

```sh
pnpm e2e             # headless run
pnpm e2e:ui          # Playwright UI mode (recommended for debugging)
pnpm e2e:install     # install the chromium browser (one-time per machine)
```

The Playwright dev server boots `vp dev --port 5173` automatically (see
[../playwright.config.ts](../playwright.config.ts)). On macOS, browser
binaries are cached at `~/Library/Caches/ms-playwright`.

The harness must run against `vp dev`, never `vp preview` — the `/cyberpunk/simulator/tests/*`
fixture routes and the `window.__cyberpunkEngine` bridge are gated behind
`import.meta.env.DEV`.

## Architecture

```
e2e/
  poms/
    SimulatorPage.ts      # top-level POM; owns the engine bridge + sub-POMs
    GameBoardSection.ts   # one side of the board (player | opponent)
    PromptBanner.ts       # per-side prompt banner + verb buttons
  fixtures/
    test.ts               # Playwright test.extend → injects `simulator` fixture
  specs/
    two-turns.spec.ts     # full SETUP → MULLIGAN → 4 half-turns flow
    play-card.spec.ts     # drag-and-drop playCard / sellCard smoke
  tsconfig.json           # scoped to e2e/**/*.ts; does not pull React app surface
```

The e2e [tsconfig.json](./tsconfig.json) deliberately excludes
`apps/multi-game-simulator/src/games/cyberpunk` — it only typechecks `e2e/**/*.ts` plus
[`../playwright.config.ts`](../playwright.config.ts). That's why
`SimulatorPage` redeclares the `ScenarioId` union and uses a structural
`CyberpunkEngineHandle` interface rather than importing the engine class.

## Two layers, every assertion

The harness asserts the **engine** value first (fast, exact via the bridge),
then asserts the **DOM** matches via Playwright's auto-retrying matchers.
A divergence between the two — engine says hand=7 but the UI rendered 6
cards — fails the test.

```ts
// expectHandSize from poms/SimulatorPage.ts:
async expectHandSize(player: PlayerId, n: number): Promise<void> {
  expect(await this.getHandSize(player), `engine hand size for ${player}`).toBe(n);
  await expect(this.boardForPlayer(player).handCards).toHaveCount(n);
}
```

Use the layered helpers as your default. Drop down to one layer only when
the other has no representation:

| Use                | When                                                         |
| ------------------ | ------------------------------------------------------------ |
| `expect*` combined | Almost always. Engine + UI must agree.                       |
| Bridge-only `getX` | The data isn't visible (e.g. specific die ids in `gainGig`). |
| UI-driven action   | Whenever a UI counterpart exists. Use `clickVerb` / `drag`.  |

## The dispatch spy

Every action that flows through `EngineProvider.dispatch` is recorded by the
bridge. Specs verify a UI click translated to the right engine call via
`expectLastDispatch`:

```ts
await simulator.clearDispatchLog();
await simulator.mulligan(first);
await simulator.expectLastDispatch({ type: "mulligan", as: first });
```

This catches silent UI bugs an engine-only assertion would miss — wrong
button wired up, missing handler, decoded action shape drifted.

The recorder is gated behind `import.meta.env.DEV` (see
`apps/multi-game-simulator/src/games/cyberpunk/engine/EngineProvider.tsx`) — production builds don't
ship the spy or the bridge.

## POM reference

All helpers live on `SimulatorPage` ([poms/SimulatorPage.ts](./poms/SimulatorPage.ts)).

### Navigation

| Helper                     | What it does                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `gotoFixture(id, { ai? })` | Navigates to `/cyberpunk/simulator/tests/${id}?ai=off` (default) and waits for the bridge. |
| `takeControl(player)`      | Flips the human seat. Mirrors the "Take Control" sidebar button.                           |
| `getHumanSide()`           | Reads the current human seat from the bridge.                                              |

### UI-driven moves

These click the rendered React tree — same path a human would take. The
dispatch spy records the resulting engine action.

| Helper                 | UI counterpart                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `mulligan(as)`         | Clicks the side's `prompt-verb-mulligan` button.                                              |
| `keepHand(as)`         | Clicks `prompt-verb-keepHand`.                                                                |
| `passPhase(as)`        | Clicks `prompt-verb-passPhase`.                                                               |
| `gainGig(dieId, as)`   | Clicks the matching `fixer-die` in the FixerZone.                                             |
| `drag(source, target)` | Raw pointer events past dnd-kit's 4px activation threshold; used for `playCard` / `sellCard`. |

### Engine state reads (bridge-only)

`getPhase`, `getTurnNumber`, `getActivePlayerId`, `getOpponentOf(player)`,
`getHandSize(player)`, `getFieldSize(player)`, `getFixerDiceCount(player)`,
`getGigCount(player)`, `getEddies(player)`, `getSpentLegendsCount(player)`,
`getPendingChoiceType(player)`, `getAllowedGigDice(player)`,
`pickFirstAllowedDie(player)`, `isGameOver()`, `getActiveSide()`.

### Combined engine + UI assertions

Prefer these whenever both layers have a representation:

| Helper                                  | Engine value                   | UI hook                                   |
| --------------------------------------- | ------------------------------ | ----------------------------------------- |
| `expectHandSize(player, n)`             | `getCardsInZone("hand")`       | `[data-testid="hand-card"]` count         |
| `expectFixerDiceCount(player, n)`       | `getFixerDice(p).length`       | `[data-testid="fixer-die"]` count         |
| `expectGigCount(player, n)`             | `getGigCount(p)`               | `[data-testid="gig-die"]` count           |
| `expectEddies(player, n)`               | `getEddies(p)`                 | `[data-testid="eddies-zone"][data-count]` |
| `expectFaceDownLegendsCount(player, n)` | `getFaceDownLegends(p).length` | `[data-face-down="true"]` slots           |
| `expectActiveBoardMode(mode)`           | `getActivePlayerId()`          | `[data-mode="..."]` on the active board   |

### Dispatch spy

| Helper                            | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `clearDispatchLog()`              | Reset the log between phases / actions.          |
| `getDispatchLog()`                | Read the recorded actions + results.             |
| `expectLastDispatch({ type, … })` | Deep-equality on every key in the latest action. |

## `data-testid` conventions

Every zone wrapper carries `data-side="player" | "opponent"` and (where
applicable) `data-count="..."` so the same locators work on both sides.

| Testid                                                                                                                                        | Owner                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `hand-zone`, `hand-card`                                                                                                                      | [HandZone.tsx](../src/components/GameBoard/HandZone.tsx)       |
| `fixer-zone`, `fixer-die`                                                                                                                     | [FixerZone.tsx](../src/components/GameBoard/FixerZone.tsx)     |
| `field-zone`, `field-unit`                                                                                                                    | [FieldZone.tsx](../src/components/GameBoard/FieldZone.tsx)     |
| `legends-zone`, `legend-slot` (`data-occupied`, `data-face-down`)                                                                             | [LegendsZone.tsx](../src/components/GameBoard/LegendsZone.tsx) |
| `eddies-zone` (`data-count`)                                                                                                                  | [EddiesZone.tsx](../src/components/GameBoard/EddiesZone.tsx)   |
| `gig-row`, `gig-die`                                                                                                                          | [CenterRow.tsx](../src/components/GameBoard/CenterRow.tsx)     |
| `prompt-banner`, `prompt-banner-title`, `prompt-banner-message`, `prompt-banner-verbs`, `prompt-verb-${moveId}`, `prompt-gain-gig-${dieType}` | [PromptBanner.tsx](../src/components/Prompt/PromptBanner.tsx)  |

The `GameBoard` root carries `data-side` + `data-mode="view" | "select-action" | "select-target"` —
that's what `expectActiveBoardMode` queries.

## Mobile caveat

The desktop layout is fully covered by these tests. The mobile layout is
**not** yet harness-friendly: [MobileBoard.tsx](../src/components/GameBoard/MobileBoard.tsx)
doesn't plumb the `side` prop into all its zones, so a mobile-viewport spec
would fail every `[data-side="..."]` query. Track W1-M will fix this — until
then, run specs at the default chromium desktop viewport.

The Vite dev iframe served by `preview` reports `vw=0`, so manually opening
a fixture in the in-IDE preview pane does not render the desktop layout.
For visual proof, write a Playwright spec — don't rely on the preview.

## Determinism

Every scenario in [../src/engine/fixtures/scenarios.ts](../src/engine/fixtures/scenarios.ts)
pins its own seed via the `SCENARIO_SEEDS` map. `createMatchState` defaults
to a stable `"default"` seed (no `Date.now()`), so reloading the same fixture
produces identical state.

`gotoFixture` always passes `?ai=off` unless explicitly overridden — the
default Board page boots a greedy AI on the rival seat that would race the
test driver and resolve pending choices before assertions could run.

## Adding a new spec — checklist

1. Branch off `main`.
2. If the flow needs a new starting state, add a fixture entry to
   [../src/engine/fixtures/scenarios.ts](../src/engine/fixtures/scenarios.ts)
   and pin a seed in `SCENARIO_SEEDS`.
3. Create `e2e/specs/your-flow.spec.ts` and import the extended fixture:
   ```ts
   import { test, expect } from "../fixtures/test";
   ```
4. Use the `simulator` fixture passed to your test:
   ```ts
   test("my flow", async ({ simulator }) => {
     await simulator.gotoFixture("openingMain");
     // …
   });
   ```
5. Prefer `simulator.expect*` over raw `getX` so engine and UI are asserted
   together.
6. For UI-driven moves, click via the POM (`mulligan`, `passPhase`, `drag`,
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
  `test-results/` artifacts on failure (per the W1-A track).

### Determinism debugging

Specs in this harness should not be flaky. If you observe flakiness, suspect:

- **AI raced you.** Confirm the spec used `gotoFixture(...)` without an
  `{ ai: "greedy" }` override — the default is `?ai=off`.
- **Stale render.** Most assertions go through Playwright's auto-retrying
  matchers (`toHaveCount`, `toHaveAttribute`), which retry until a timeout.
  A bare `await sim.getHandSize(p)` returns the _latest_ engine snapshot
  with no retry — if the move was UI-driven and React hasn't flushed, that
  read can land on the pre-state. Either drive through the POM (which
  already calls `forceRender` for bridge-only moves) or assert via
  `expect*` so Playwright retries.
- **Different seed.** If you pulled a new fixture into `SCENARIO_SEEDS`,
  earlier hand contents may shift — pin the seed to a value that gives you
  the cards you need rather than asserting on whichever cards happened to
  draw last time.
