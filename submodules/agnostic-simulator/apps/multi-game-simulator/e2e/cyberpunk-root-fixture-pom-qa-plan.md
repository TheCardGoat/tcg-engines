# Cyberpunk Root Fixture POM QA Implementation Plan

## Purpose

Implement one jsdom test file and one Playwright test file for every Cyberpunk root fixture scenario returned by `listScenarios()`.

The tests should act as simulator QA coverage, not duplicate pure engine unit tests. Each fixture test should prove that the simulator can:

- Mount the fixture with AI disabled.
- Expose the same state through the shared `CyberpunkSimulatorPom` in jsdom and Playwright.
- Present the correct legal interactions for the scenario.
- Drive the smallest meaningful user interaction for the fixture.
- Verify that the engine state and rendered board state agree after the interaction.

## Long-Running Agent Task

Use this file as the task brief for a long-running implementation agent.

Objective:

Implement behavior-level jsdom and Playwright POM coverage for every scenario returned by `listScenarios()` in the Cyberpunk simulator root fixture chooser.

Scope:

- Work inside `submodules/agnostic-simulator/apps/multi-game-simulator` unless a simulator-visible engine bug requires a focused engine fix.
- For each fixture, create or update exactly one shared behavior file, one jsdom wrapper, and one Playwright wrapper.
- Extend `CyberpunkSimulatorPom` only with reusable, runner-agnostic reads/actions. Do not add fixture-specific methods.
- Keep behavior assertions focused on simulator QA: visible legal choices, semantic user flow, and agreement between rendered state and engine state.
- If a fixture exposes a real simulator or rules bug, fix the bug and keep the test. Skip only for unrelated infrastructure failures and document the skip in the behavior file.

Current status snapshot:

- `listScenarios()` currently returns 67 root fixtures.
- 67 fixtures currently have behavior, jsdom, and Playwright files.
- Implemented groups: all core fixtures, all current program fixtures, all gear fixtures, all legend fixtures, and all unit fixtures.
- Remaining work: none for scenarios currently returned by `listScenarios()`.
- `progPeaceOffering` exists in `SCENARIO_SEEDS` but is not currently returned by `listScenarios()`; do not create root fixture tests for it unless it becomes a root fixture.

Agent loop:

1. Refresh the fixture list with:

   ```sh
   pnpm exec tsx -e "import { listScenarios } from './src/engine/fixtures/scenarios'; console.log(listScenarios().map((s) => s.id).join('\n'))"
   ```

2. Pick the next planned fixture from the Progress Tracker.
3. Read the fixture definition in `src/engine/fixtures/scenarios/*.ts`.
4. Read the referenced card or engine unit test listed in this document.
5. Use a small `pnpm exec tsx` probe when needed to confirm exact engine state before and after the intended action.
6. Add missing generic POM capabilities before writing the behavior.
7. Add `src/testing/fixture-behaviors/<scenarioId>.ts`.
8. Add `src/testing/fixtures/jsdom/<scenarioId>.test.tsx`.
9. Add `e2e/specs/root-fixtures/<scenarioId>.spec.ts`.
10. Run focused validation for that fixture or group.
11. Update the Progress Tracker in this file.
12. Continue until every fixture in `listScenarios()` is implemented.

Per-fixture acceptance checklist:

- Behavior begins with `await pom.waitForReady()` and structural state assertions.
- The behavior performs at least one fixture-specific interaction or includes a clear static-render assertion for visual/static fixtures.
- The same behavior is used by jsdom and Playwright.
- The Playwright route includes `?ai=off&auto-advance-attack=off` when the behavior needs stable manual attack-flow inspection.
- Assertions cover both engine state and DOM state when the state is visible.
- The behavior references the matching unit test or scenario source in `references`.

## Progress Tracker

Update this table as each fixture is implemented. Status means all three files exist: shared behavior, jsdom wrapper, and Playwright wrapper.

| Fixture                                     | Group                    | Status      | Behavior | jsdom | Playwright |
| ------------------------------------------- | ------------------------ | ----------- | -------- | ----- | ---------- |
| `gameStart`                                 | core                     | Implemented | yes      | yes   | yes        |
| `openingMain`                               | core                     | Implemented | yes      | yes   | yes        |
| `attackStep`                                | core                     | Implemented | yes      | yes   | yes        |
| `defensiveStep`                             | core                     | Implemented | yes      | yes   | yes        |
| `chooseCardTarget`                          | core                     | Implemented | yes      | yes   | yes        |
| `opponentTurn`                              | core                     | Implemented | yes      | yes   | yes        |
| `stealGigTest`                              | core                     | Implemented | yes      | yes   | yes        |
| `endGame`                                   | core                     | Implemented | yes      | yes   | yes        |
| `progCorporateSurveillance`                 | program-spend            | Implemented | yes      | yes   | yes        |
| `progCorporateSurveillanceNoTargets`        | program-spend            | Implemented | yes      | yes   | yes        |
| `progFloorIt`                               | program-bounce           | Implemented | yes      | yes   | yes        |
| `progFloorItNoTargets`                      | program-bounce           | Implemented | yes      | yes   | yes        |
| `progIndustrialAssembly`                    | program-gig              | Implemented | yes      | yes   | yes        |
| `progIndustrialAssemblyHighCred`            | program-gig              | Implemented | yes      | yes   | yes        |
| `progRebootOptics`                          | program-power            | Implemented | yes      | yes   | yes        |
| `progRebootOpticsEmptyField`                | program-power            | Implemented | yes      | yes   | yes        |
| `progAfterpartyAtLizzies`                   | program-gig-manipulation | Implemented | yes      | yes   | yes        |
| `progCyberpsychosis`                        | program-power            | Implemented | yes      | yes   | yes        |
| `progChromeReverie`                         | program-legend-call      | Implemented | yes      | yes   | yes        |
| `gearDyingNightHighCred`                    | gear-attack-trigger      | Implemented | yes      | yes   | yes        |
| `gearDyingNightLowCred`                     | gear-attack-trigger      | Implemented | yes      | yes   | yes        |
| `gearKiroshiOptics`                         | gear-attack-trigger      | Implemented | yes      | yes   | yes        |
| `gearKiroshiOpticsNoFaceDown`               | gear-attack-trigger      | Implemented | yes      | yes   | yes        |
| `gearMandibularUpgrade`                     | gear-blocker             | Implemented | yes      | yes   | yes        |
| `gearMantisBlades`                          | gear-stat-boost          | Implemented | yes      | yes   | yes        |
| `gearSandevistan`                           | gear-rush                | Implemented | yes      | yes   | yes        |
| `gearSatoriSwordOfSaburo`                   | gear-fight-reward        | Implemented | yes      | yes   | yes        |
| `gearGorillaArms`                           | gear-gig-steal           | Implemented | yes      | yes   | yes        |
| `gearZetatechFaceplate`                     | gear-spent-trigger       | Implemented | yes      | yes   | yes        |
| `gearAttachToGoSoloLegend`                  | gear-stat-boost          | Implemented | yes      | yes   | yes        |
| `legendVCorporateExile`                     | legend-go-solo           | Implemented | yes      | yes   | yes        |
| `legendGoroTakemuraHandsUnclean`            | legend-go-solo           | Implemented | yes      | yes   | yes        |
| `legendVStreetkid`                          | legend-defeated          | Implemented | yes      | yes   | yes        |
| `legendRoycePsychoOnTheEdge`                | legend-go-solo           | Implemented | yes      | yes   | yes        |
| `legendAltCunninghamSoulkillerArchitect`    | legend-go-solo           | Implemented | yes      | yes   | yes        |
| `legendSaburoArasakaStubbornPatriach`       | legend-passive           | Implemented | yes      | yes   | yes        |
| `legendYorinobuArasakaEmbracingDestruction` | legend-attack-trigger    | Implemented | yes      | yes   | yes        |
| `legendJackieWellesPourOneOutForMe`         | legend-attack-trigger    | Implemented | yes      | yes   | yes        |
| `legendViktorVektorSitDownAndRelax`         | legend-call-trigger      | Implemented | yes      | yes   | yes        |
| `legendViktorOpponentPrivateSearch`         | legend-call-trigger      | Implemented | yes      | yes   | yes        |
| `legendEvelynParkerBeautifulEnigma`         | legend-call-trigger      | Implemented | yes      | yes   | yes        |
| `legendRiverWardDetectiveOnTheHunt`         | legend-call-trigger      | Implemented | yes      | yes   | yes        |
| `legendDumDumMaelstromTriggerman`           | legend-call-trigger      | Implemented | yes      | yes   | yes        |
| `legendPanamPalmerNomadCavalry`             | legend-call-trigger      | Implemented | yes      | yes   | yes        |
| `legendGoroTakemuraVengefulBodyguard`       | legend-call-trigger      | Implemented | yes      | yes   | yes        |
| `unitSecondhandBombus`                      | unit-blocker             | Implemented | yes      | yes   | yes        |
| `unitCorpoSecurity`                         | unit-blocker             | Implemented | yes      | yes   | yes        |
| `unitRuthlessLowlife`                       | unit-gig-stolen          | Implemented | yes      | yes   | yes        |
| `unitEvelynParkerSchemingSiren`             | unit-gig-stolen          | Implemented | yes      | yes   | yes        |
| `unitJackieWellesRideOrDieChoom`            | unit-power-scaling       | Implemented | yes      | yes   | yes        |
| `unitGoroTakemuraLosingHisWay`              | unit-power-scaling       | Implemented | yes      | yes   | yes        |
| `unitMt0d12Flathead`                        | unit-street-cred         | Implemented | yes      | yes   | yes        |
| `unitArmoredMinotaur`                       | unit-street-cred         | Implemented | yes      | yes   | yes        |
| `unitHanakoArasakaInAGildedCage`            | unit-play-trigger        | Implemented | yes      | yes   | yes        |
| `unitGildedMaton`                           | unit-play-trigger        | Implemented | yes      | yes   | yes        |
| `unitMamanBrigitte`                         | unit-play-trigger        | Implemented | yes      | yes   | yes        |
| `unitPlacideVoodooSentinel`                 | unit-play-trigger        | Implemented | yes      | yes   | yes        |
| `unitAdamSmasherMetalOverMeat`              | unit-play-trigger        | Implemented | yes      | yes   | yes        |
| `unitElSombreronLaVenganzaLenta`            | unit-attack-trigger      | Implemented | yes      | yes   | yes        |
| `unitCaliberTotentanzSTopDog`               | unit-defeated            | Implemented | yes      | yes   | yes        |
| `unitMeredithStoutStoneColdCorpo`           | unit-gig-condition       | Implemented | yes      | yes   | yes        |
| `unitKerryEurodyneTheLastRockerboy`         | unit-gig-condition       | Implemented | yes      | yes   | yes        |
| `unitRidingNomad`                           | unit-rush                | Implemented | yes      | yes   | yes        |
| `unitRoyceDonTCallMeSimonHighCred`          | unit-street-cred         | Implemented | yes      | yes   | yes        |
| `unitRoyceDonTCallMeSimonLowCred`           | unit-street-cred         | Implemented | yes      | yes   | yes        |
| `unitSandayuOdaHanakoSGuardian`             | unit-rush                | Implemented | yes      | yes   | yes        |
| `progCarnageAtTheColosseum`                 | program-cost-modifier    | Implemented | yes      | yes   | yes        |

## Current Context

The root fixture chooser is rendered by `HomePage` and derives scenarios from `listScenarios()` in:

- `apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/index.ts`

Fixture source files:

- `apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/core.ts`
- `apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/programs.ts`
- `apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/gears.ts`
- `apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/legends.ts`
- `apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts`

Existing relevant simulator/POM files:

- `apps/multi-game-simulator/src/games/cyberpunk/testing/cyberpunk-simulator-pom.ts`
- `apps/multi-game-simulator/src/games/cyberpunk/testing/window-cyberpunk-harness-client.ts`
- `apps/multi-game-simulator/src/games/cyberpunk/testing/render-cyberpunk-simulator.tsx`
- `apps/simulator/e2e/poms/CyberpunkPlaywrightHarnessClient.ts`
- `apps/multi-game-simulator/src/games/cyberpunk/testing/root-fixture-scenarios.ts`

Existing broad smoke tests:

- `apps/multi-game-simulator/src/games/cyberpunk/testing/cyberpunk-simulator-pom-root-fixtures.test.tsx`
- `apps/simulator/e2e/specs/root-fixtures-pom.spec.ts`

These smoke tests validate mount/readiness and structural state. The work in this plan adds behavior-level QA coverage for each fixture.

## Validation Steps

Run these from `submodules/agnostic-simulator/apps/multi-game-simulator` after `vp install` in the
Cyberpunk workspace:

1. Build workspace libraries required by browser tests.

   ```sh
   vp run -w build:libs
   ```

2. Run the POM driver smoke test and a representative slice of behavior tests.

   ```sh
   vp test run src/testing/cyberpunk-simulator-pom.test.tsx \
     src/testing/fixtures/jsdom/attackStep.test.tsx \
     src/testing/fixtures/jsdom/gameStart.test.tsx \
     src/testing/fixtures/jsdom/progChromeReverie.test.tsx
   ```

3. Run every jsdom fixture behavior file.

   ```sh
   vp test run src/testing/fixtures/jsdom/*.test.tsx
   ```

4. Run every Chromium browser fixture behavior and the structural browser smoke
   tests.

   ```sh
   pnpm exec playwright test --project=chromium e2e/specs/root-fixtures
   ```

5. Start the local simulator and manually verify a fixture route in a browser.

   ```sh
   vp dev --port 5173
   ```

   Open
   `http://localhost:5173/cyberpunk/simulator/tests/attackStep?ai=off&auto-advance-attack=off`,
   confirm the board renders, click `Fight`, and confirm the visible prompt
   changes to attacker selection.

Latest local validation on 2026-06-01:

- `vp test run src/testing/cyberpunk-simulator-pom.test.tsx src/testing/fixtures/jsdom/attackStep.test.tsx src/testing/fixtures/jsdom/gameStart.test.tsx src/testing/fixtures/jsdom/progChromeReverie.test.tsx`: 4 files, 4 tests passed.
- `vp test run src/testing/fixtures/jsdom/*.test.tsx`: 67 files, 67 tests passed.
- `pnpm exec playwright test --project=chromium e2e/specs/root-fixtures`: 134 tests passed.
- Browser route `/cyberpunk/simulator/tests/attackStep?ai=off&auto-advance-attack=off`: rendered and advanced from the initial action prompt into attacker selection.

## Rules References

Before implementing behavior tests, load the Cyberpunk rules skill:

- `submodules/cyberpunk/.agents/skills/cyberpunk-tcg-rules/SKILL.md`

Relevant rule references for this task:

- `references/turn-structure.md`
- `references/combat-and-gigs.md`
- `references/cards-and-keywords.md`

Key rule constraints to keep in mind:

- Card text overrides base rules.
- Units with lag cannot attack unless an effect says they can.
- Attacks can target spent rival units or the rival directly.
- Ready blocker units can redirect direct attacks.
- Direct attacks steal gigs only if they connect.
- Gear moves with its host when the host moves zones.
- Programs resolve once and move to trash.
- Legends start face-down and can be called for 1 eddie.
- GO SOLO legends enter the field ready and can attack that turn.

## Target File Layout

Create a shared fixture behavior registry:

- `apps/multi-game-simulator/src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior.ts`
- `apps/multi-game-simulator/src/games/cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior.ts`
- `apps/multi-game-simulator/src/games/cyberpunk/testing/fixture-behaviors/<scenarioId>.ts`

Create one jsdom wrapper file per fixture:

- `apps/multi-game-simulator/src/games/cyberpunk/testing/fixtures/jsdom/<scenarioId>.test.tsx`

Create one Playwright wrapper file per fixture:

- `apps/simulator/e2e/specs/root-fixtures/<scenarioId>.spec.ts`

Wrapper files should be thin. They should import the shared behavior for the scenario and run it through the relevant harness.

Example jsdom wrapper shape:

```ts
import { describe, test, vi } from "vite-plus/test";
import { runCyberpunkFixtureBehaviorInJsdom } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior";
import { gameStartBehavior } from "../../fixture-behaviors/gameStart";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

describe("gameStart fixture", () => {
  test("matches its simulator QA behavior", async () => {
    await runCyberpunkFixtureBehaviorInJsdom(gameStartBehavior);
  });
});
```

Example Playwright wrapper shape:

```ts
import { test } from "@playwright/test";
import { runCyberpunkFixtureBehaviorInPlaywright } from "../../src/testing/fixture-behaviors/run-cyberpunk-fixture-behavior";
import { gameStartBehavior } from "../../src/testing/fixture-behaviors/gameStart";
import { createPlaywrightCyberpunkSimulatorPom } from "../poms/CyberpunkPlaywrightHarnessClient";

test("gameStart matches its simulator QA behavior", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/gameStart?ai=off");
  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await runCyberpunkFixtureBehaviorInPlaywright(gameStartBehavior, pom);
});
```

Adjust import paths as needed during implementation.

## Shared Behavior Interface

Use a shared interface that keeps the per-fixture behavior declarative and runner-agnostic.

```ts
import type { ScenarioId } from "../root-fixture-scenarios";
import type { CyberpunkSimulatorPom } from "../cyberpunk-simulator-pom";

export interface CyberpunkFixtureBehavior {
  readonly scenarioId: ScenarioId;
  readonly label: string;
  readonly references: readonly string[];
  readonly run: (pom: CyberpunkSimulatorPom) => Promise<void>;
}
```

Every behavior should start with:

```ts
await pom.waitForReady();
await pom.expectStructuralState();
```

Then it should assert and drive the fixture-specific interaction.

## POM Capability Gaps To Implement First

The current POM supports structural reads plus a few actions. Add reusable methods before writing all fixture specs.

State reads:

- `getCardsInZone(zone, player)`
- `getCardByDefinitionId(definitionId, zone, player)`
- `getCardState(cardRef)`
- `getEffectivePower(cardRef)`
- `getGigDice(player)`
- `getStreetCred(player)`
- `getPendingChoice(player)`
- `getEligibleTargetIds(player)`
- `getEventLogEntries()`
- `getMoveLogs()`

DOM reads:

- field unit by card id and by card name
- hand card by card id and by card name
- legend slot by index and by public card name
- attached gear under a field unit or legend
- event log entry by type/message
- choice modal options
- target candidate buttons
- gig dice in gig/fixer areas

Actions:

- play card from hand by definition id
- sell card from hand
- attach gear to field unit or legend
- call legend
- go solo legend
- attack rival
- attack unit
- resolve attack
- use blocker
- pass phase
- complete turn when exposed through UI or harness
- resolve effect target
- resolve card-to-play choice
- resolve card-to-move choice
- resolve search deck choice
- resolve adjust-gig choice
- resolve steal-gigs choice
- activate ability by card and ability index

Implementation note:

- Prefer real DOM interactions when the simulator has a visible control.
- For interactions not yet exposed in the UI, use semantic harness dispatch through the shared POM and force render afterwards. Keep the method names user-facing, for example `resolveStealGigs(...)`, so later UI wiring can replace internals without rewriting fixture behaviors.

## Definition Of Done

For every scenario in `listScenarios()`:

- A jsdom test file exists.
- A Playwright test file exists.
- Both files use the same shared `CyberpunkFixtureBehavior`.
- The behavior contains at least one fixture-specific interaction or, for purely visual/static fixtures, a reasoned static assertion.
- The behavior references the matching engine/card unit test file when one exists.
- The test validates both engine state and DOM state where the UI renders that state.
- No fixture is skipped unless a failure is clearly infrastructure-only and documented in the behavior file.

## Fixture QA Plans

### Core Fixtures

| Fixture            | Unit/Test References                                                                                                     | Interaction Plan                                          | Required Assertions                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `gameStart`        | `packages/engine/tests/setup.test.ts`, `packages/engine/tests/flow/two-turns.test.ts`                                    | Keep or mulligan both players.                            | Setup phase, 3 face-down legends per side, 6 hand cards per side, fixer dice present. After both setup choices, phase advances and hand counts update. |
| `openingMain`      | `packages/engine/tests/flow/two-turns.test.ts`                                                                           | Select a playable hand card or pass phase.                | P1 active in main phase, P1 has legal actions, P2 is view-only from P1 perspective, structural state remains consistent after action.                  |
| `attackStep`       | `packages/engine/tests/flow/two-turns-with-moves.test.ts`                                                                | Attack a spent rival unit with a ready attacker.          | Attacker becomes spent, attack enters fight/defensive flow, target was a spent rival unit, event log records attack.                                   |
| `defensiveStep`    | `packages/engine/tests/flow/two-turns-with-moves.test.ts`                                                                | Use a blocker or resolve the attack.                      | P1 defensive prompt exposes blocker/resolve actions only, blocker redirects direct attack into a fight, no gig is stolen when blocked.                 |
| `chooseCardTarget` | `apps/multi-game-simulator/src/games/cyberpunk/engine/__tests__/useInteractionPermission.test.ts`                        | Resolve `chooseCardToPlay` by choosing a hand card.       | Board is in target mode, eligible hand cards are selectable, chosen card leaves hand and resolves as free play.                                        |
| `opponentTurn`     | `packages/engine/tests/flow/two-turns.test.ts`                                                                           | Take control of P2 and pass/perform available action.     | P1 sees opponent-is-choosing state, P2 can act after control switch, active side remains correct.                                                      |
| `stealGigTest`     | `packages/engine/tests/flow/two-turns-with-moves.test.ts`, `packages/engine/src/cards/spoiler/gear/gorilla-arms.test.ts` | Direct attack and resolve gig theft.                      | Direct attack creates steal choice when needed, selected gig moves from rival to attacker, event log records steal.                                    |
| `endGame`          | `packages/engine/tests/win-condition-gigs.test.ts`, `packages/engine/tests/win-condition-overtime.test.ts`               | Assert dense late-game state, then pass/advance if legal. | Game board is not broken by late-game density, revealed legends render, gig and field counts match engine, game status matches engine.                 |

### Program Fixtures

| Fixture                              | Unit/Test References                                                          | Interaction Plan                                                          | Required Assertions                                                                                                               |
| ------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `progCorporateSurveillance`          | `packages/engine/src/cards/alpha/programs/corporate-surveillance.test.ts`     | Play Corporate Surveillance and choose an eligible rival low-cost unit.   | Only rival units with cost <= 3 are eligible, chosen unit becomes spent, program moves to trash, eddies decrease by 2.            |
| `progCorporateSurveillanceNoTargets` | `packages/engine/src/cards/alpha/programs/corporate-surveillance.test.ts`     | Play Corporate Surveillance.                                              | No target prompt or auto-resolved no-target path, high-cost rival unit remains unspent, program resolves cleanly.                 |
| `progFloorIt`                        | `packages/engine/src/cards/alpha/programs/floor-it.test.ts`                   | Play Floor It and choose a spent low-cost unit.                           | Spent cost <= 4 unit returns to owner's hand, ready/high-cost units are not eligible, program moves to trash.                     |
| `progFloorItNoTargets`               | `packages/engine/src/cards/alpha/programs/floor-it.test.ts`                   | Play Floor It.                                                            | No legal target, spent high-cost or ready units remain on field, no stale choice prompt remains.                                  |
| `progIndustrialAssembly`             | `packages/engine/src/cards/alpha/programs/industrial-assembly.test.ts`        | Play Industrial Assembly and resolve friendly gig increase.               | Friendly gig value increases, no bonus draw below Street Cred threshold, eddies and program zone update.                          |
| `progIndustrialAssemblyHighCred`     | `packages/engine/src/cards/alpha/programs/industrial-assembly.test.ts`        | Play Industrial Assembly and resolve gig increase.                        | Friendly gig value increases, 7+ Street Cred bonus draw happens, hand/deck counts update.                                         |
| `progRebootOptics`                   | `packages/engine/src/cards/alpha/programs/reboot-optics.test.ts`              | Play Reboot Optics and target a friendly unit.                            | Friendly unit receives +4 power effect, only friendly units are eligible, program moves to trash.                                 |
| `progRebootOpticsEmptyField`         | `packages/engine/src/cards/alpha/programs/reboot-optics.test.ts`              | Play Reboot Optics.                                                       | No friendly unit target exists, field remains unchanged, program resolves cleanly.                                                |
| `progAfterpartyAtLizzies`            | `packages/engine/src/cards/spoiler/programs/afterparty-at-lizzie-s.test.ts`   | Play Afterparty and resolve rival gig adjustment.                         | Rival gig value changes, matching friendly gig condition triggers bonus draw, DOM gig face value updates.                         |
| `progCyberpsychosis`                 | `packages/engine/src/cards/spoiler/programs/cyberpsychosis.test.ts`           | Play Cyberpsychosis, pay/spend the required source, target equipped unit. | Additional cost source spends, equipped unit gets +2 power per gear, prompt targets only valid cards.                             |
| `progChromeReverie`                  | `packages/engine/src/cards/spoiler/programs/chrome-reverie.test.ts`           | Play Chrome Reverie and resolve free legend call/target flow.             | Min-value gig condition enables free legend call, selected legend flips, follow-up rival unit target state appears if applicable. |
| `progCarnageAtTheColosseum`          | `packages/engine/src/cards/spoiler/programs/carnage-at-the-colosseum.test.ts` | Play Carnage at reduced cost and choose a weaker rival unit.              | Cost is reduced by friendly gigs at value 8+, only weaker rival units are eligible, selected unit is defeated.                    |

### Gear Fixtures

| Fixture                       | Unit/Test References                                                                                                                                  | Interaction Plan                                                         | Required Assertions                                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `gearDyingNightHighCred`      | `packages/engine/src/cards/alpha/gear/dying-night-v-s-pistol.test.ts`                                                                                 | Attack with Dying Night host and choose rival gear.                      | Street Cred >= 7 enables gear defeat, rival gear moves to trash, attack continues correctly.                     |
| `gearDyingNightLowCred`       | `packages/engine/src/cards/alpha/gear/dying-night-v-s-pistol.test.ts`                                                                                 | Attack with Dying Night host.                                            | Street Cred < 7 prevents gear-defeat prompt, rival gear remains attached.                                        |
| `gearKiroshiOptics`           | `packages/engine/src/cards/alpha/gear/kiroshi-optics.test.ts`                                                                                         | Attack with Kiroshi host and choose a face-down friendly legend to peek. | Face-down friendly legends are eligible, chosen legend remains face-down, peek state is visible only to owner.   |
| `gearKiroshiOpticsNoFaceDown` | `packages/engine/src/cards/alpha/gear/kiroshi-optics.test.ts`                                                                                         | Attack with Kiroshi host.                                                | No face-down legend prompt appears, all face-up legends remain unchanged.                                        |
| `gearMandibularUpgrade`       | `packages/engine/src/cards/alpha/gear/mandibular-upgrade.test.ts`, `apps/multi-game-simulator/src/games/cyberpunk/engine/__tests__/scenarios.test.ts` | Use equipped host as blocker during defensive step.                      | Host has BLOCKER from gear, host spends to block, attack becomes fight, no gig is stolen.                        |
| `gearMantisBlades`            | `packages/engine/src/cards/alpha/gear/mantis-blades.test.ts`                                                                                          | Read host effective power.                                               | Host power includes +2 gear bonus, attached gear renders under host, engine and DOM power agree.                 |
| `gearSandevistan`             | `packages/engine/src/cards/alpha/gear/sandevistan.test.ts`                                                                                            | Play host, attach Sandevistan, attack spent rival unit same turn.        | Gear grants attack-on-play against units, direct attack remains illegal unless another effect allows it.         |
| `gearSatoriSwordOfSaburo`     | `packages/engine/src/cards/alpha/gear/satori-sword-of-saburo.test.ts`                                                                                 | Attack spent rival unit and win fight.                                   | Fight win draws 1 card, defender is defeated, Satori stays attached if host survives.                            |
| `gearGorillaArms`             | `packages/engine/src/cards/spoiler/gear/gorilla-arms.test.ts`                                                                                         | Direct attack, choose a d4 to steal, resolve same-sided trigger.         | First stolen d4 triggers extra same-sided d4 steal, P1 gig count increases, P2 gig count decreases.              |
| `gearZetatechFaceplate`       | `packages/engine/src/cards/spoiler/gear/zetatech-faceplate.test.ts`                                                                                   | Assert attached gear state and activate/resolve if available.            | Gear attached to face-up legend or host renders correctly, distinct-value gig condition is visible and stateful. |
| `gearAttachToGoSoloLegend`    | `packages/engine/src/cards/alpha/gear/mantis-blades.test.ts`                                                                                          | Attach Mantis Blades to GO SOLO legend on the field.                     | Fielded legend is a valid gear target, gear attaches, effective power increases.                                 |

### Legend Fixtures

| Fixture                                     | Unit/Test References                                                                     | Interaction Plan                                         | Required Assertions                                                                                                   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `legendVCorporateExile`                     | `packages/engine/src/cards/alpha/legends/v-corporate-exile.test.ts`                      | Use Go Solo.                                             | V leaves legend area and enters field ready, V can attack this turn, eddies decrease by cost.                         |
| `legendGoroTakemuraHandsUnclean`            | `packages/engine/src/cards/alpha/legends/goro-takemura-hands-unclean.test.ts`            | Use Go Solo and assert blocker capability.               | Goro enters field ready with BLOCKER, can attack this turn, can later block when timing allows.                       |
| `legendVStreetkid`                          | `packages/engine/src/cards/spoiler/legends/v-streetkid.test.ts`                          | Go Solo, then set up or perform defeat.                  | Defeated trigger mills/retrieves Braindance program, zone/removal behavior matches engine.                            |
| `legendRoycePsychoOnTheEdge`                | `packages/engine/src/cards/spoiler/legends/royce-psycho-on-the-edge.test.ts`             | Assert effective power, then Go Solo.                    | Gear-scaled legend power includes +2 per gear, fielded Royce keeps expected power.                                    |
| `legendAltCunninghamSoulkillerArchitect`    | `packages/engine/src/cards/spoiler/legends/alt-cunningham-soulkiller-architect.test.ts`  | Direct attack, steal gig, resolve replay-program choice. | Alt is removed after trigger, Corporate Surveillance from trash can be played free, follow-up target resolves.        |
| `legendSaburoArasakaStubbornPatriach`       | `packages/engine/src/cards/alpha/legends/saburo-arasaka-stubborn-patriach.test.ts`       | Attack with Arasaka unit.                                | Passive +1 power applies during Arasaka attack, non-Arasaka unit does not receive it.                                 |
| `legendYorinobuArasakaEmbracingDestruction` | `packages/engine/src/cards/alpha/legends/yorinobu-arasaka-embracing-destruction.test.ts` | Attack first time with Arasaka unit.                     | First Arasaka attack draws, below 20 Street Cred discard path is exposed/resolved.                                    |
| `legendJackieWellesPourOneOutForMe`         | `packages/engine/src/cards/alpha/legends/jackie-welles-pour-one-out-for-me.test.ts`      | Play a blue gear/card.                                   | First blue unit/gear played triggers friendly gig increase, maxed gig causes draw.                                    |
| `legendViktorVektorSitDownAndRelax`         | `packages/engine/src/cards/alpha/legends/viktor-vektor-sit-down-and-relax.test.ts`       | Call Viktor and resolve deck search.                     | Top-5 search modal shows valid low-cost gear, selected gear moves to hand, search is owner-visible.                   |
| `legendViktorOpponentPrivateSearch`         | `packages/engine/src/cards/alpha/legends/viktor-vektor-sit-down-and-relax.test.ts`       | View from P1 while P2 is choosing, then take P2 control. | P1 sees opponent-choosing state only, P2 search candidates are not visible to P1, candidates appear after P2 control. |
| `legendEvelynParkerBeautifulEnigma`         | `packages/engine/src/cards/spoiler/legends/evelyn-parker-beautiful-enigma.test.ts`       | Call/activate Evelyn search flow.                        | Rival gig decreases by 3, spend ability searches top 3 for Braindance hit.                                            |
| `legendRiverWardDetectiveOnTheHunt`         | `packages/engine/src/cards/spoiler/legends/river-ward-detective-on-the-hunt.test.ts`     | Attack with unit and resolve River trigger.              | River spends to equip low-cost gear from hand to valid yellow unit for free.                                          |
| `legendDumDumMaelstromTriggerman`           | `packages/engine/src/cards/spoiler/legends/dum-dum-maelstrom-triggerman.test.ts`         | Call Dum Dum and choose gear defeat or decline.          | Defeating friendly gear draws 4, decline draws 1, chosen gear detaches and moves to trash.                            |
| `legendPanamPalmerNomadCavalry`             | `packages/engine/src/cards/spoiler/legends/panam-palmer-nomad-cavalry.test.ts`           | Attack with friendly unit and resolve Panam trigger.     | Panam spends, transfers gear to attacker, readies attacker.                                                           |
| `legendGoroTakemuraVengefulBodyguard`       | `packages/engine/src/cards/spoiler/legends/goro-takemura-vengeful-bodyguard.test.ts`     | During rival attack, resolve Goro defensive trigger.     | Friendly eligible unit gets +1 power and BLOCKER from sided-pair gigs, then can redirect attack.                      |

### Unit Fixtures

| Fixture                             | Unit/Test References                                                                                                                                                | Interaction Plan                                                 | Required Assertions                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `unitSecondhandBombus`              | `packages/engine/src/cards/alpha/units/secondhand-bombus.test.ts`                                                                                                   | Use Bombus as blocker.                                           | Bombus can block but cannot attack, Bombus spends to redirect rival attack.                                     |
| `unitCorpoSecurity`                 | `packages/engine/src/cards/alpha/units/corpo-security.test.ts`                                                                                                      | Check action candidates from P2 side.                            | Corpo Security has BLOCKER but is not an attack candidate due cant-attack static rule.                          |
| `unitRuthlessLowlife`               | `packages/engine/src/cards/alpha/units/ruthless-lowlife.test.ts`                                                                                                    | Let rival steal a friendly gig.                                  | Stolen gig face value becomes 1 while Ruthless Lowlife is spent.                                                |
| `unitEvelynParkerSchemingSiren`     | `packages/engine/src/cards/alpha/units/evelyn-parker-scheming-siren.test.ts`                                                                                        | Let rival steal a friendly gig.                                  | Spent Evelyn trigger draws 1 when friendly gig is stolen.                                                       |
| `unitJackieWellesRideOrDieChoom`    | `packages/engine/src/cards/alpha/units/jackie-welles-ride-or-die-choom.test.ts`                                                                                     | Read effective power and optionally attack.                      | Power equals base 6 plus 2 per friendly gig, rendered power matches engine.                                     |
| `unitGoroTakemuraLosingHisWay`      | `packages/engine/src/cards/alpha/units/goro-takemura-losing-his-way.test.ts`                                                                                        | Read effective power on friendly turn.                           | Power gets +1 per friendly face-up legend on friendly turn, DOM and engine agree.                               |
| `unitMt0d12Flathead`                | `packages/engine/src/cards/alpha/units/mt0d12-flathead.test.ts`                                                                                                     | Direct attack while rival has blockers.                          | 7+ Street Cred makes Flathead unblockable, blocker action is unavailable.                                       |
| `unitArmoredMinotaur`               | `packages/engine/src/cards/alpha/units/armored-minotaur.test.ts`                                                                                                    | Play Armored Minotaur and choose rival target.                   | 12+ Street Cred enables target with power <= 5, selected rival unit moves to trash.                             |
| `unitHanakoArasakaInAGildedCage`    | `packages/engine/src/cards/spoiler/units/hanako-arasaka-in-a-gilded-cage.test.ts`                                                                                   | Play Hanako and resolve deck reveal/search.                      | Cost-matching card from top deck goes to hand, non-matches move according to engine behavior.                   |
| `unitGildedMaton`                   | `packages/engine/src/cards/spoiler/units/gilded-maton.test.ts`                                                                                                      | Play Gilded Maton, choose friendly gear, then choose rival unit. | Friendly gear is defeated as cost, low-cost rival unit is defeated if cost was paid.                            |
| `unitMamanBrigitte`                 | `packages/engine/src/cards/spoiler/units/maman-brigitte.test.ts`                                                                                                    | Play Maman, choose two programs, target unequipped rival unit.   | Only programs are discard candidates, only unequipped rival unit is eligible, target is bottom-decked.          |
| `unitPlacideVoodooSentinel`         | `packages/engine/src/cards/spoiler/units/placide-voodoo-sentinel.test.ts`                                                                                           | Play Placide, discard program, choose rival unit.                | Program discard enables bottom-deck rival unit, same action path can be used again on attack.                   |
| `unitAdamSmasherMetalOverMeat`      | `packages/engine/src/cards/spoiler/units/adam-smasher-metal-over-meat.test.ts`                                                                                      | Play Adam Smasher.                                               | All other units on both fields are defeated, Adam remains on field.                                             |
| `unitElSombreronLaVenganzaLenta`    | `packages/engine/src/cards/spoiler/units/el-sombreron-la-venganza-lenta.test.ts`                                                                                    | Attack spent rival unit.                                         | Attack trigger doubles El Sombreron power during fight, defender is defeated.                                   |
| `unitCaliberTotentanzSTopDog`       | `packages/engine/src/cards/spoiler/units/caliber-totentanz-s-top-dog.test.ts`                                                                                       | Have Caliber defeated in fight.                                  | Rival discards 1, then bonus discard happens if discarded cost matches friendly gig value.                      |
| `unitMeredithStoutStoneColdCorpo`   | `packages/engine/src/cards/spoiler/units/meredith-stout-stone-cold-corpo.test.ts`                                                                                   | Trigger a rival-caused friendly gig decrease.                    | Meredith offers/executes trash recovery when rival decreases friendly gig.                                      |
| `unitKerryEurodyneTheLastRockerboy` | `packages/engine/src/cards/spoiler/units/kerry-eurodyne-the-last-rockerboy.test.ts`                                                                                 | Activate Kerry spend ability.                                    | Kerry spends, friendly max-value gig condition draws 2.                                                         |
| `unitRidingNomad`                   | `packages/engine/src/cards/spoiler/units/riding-nomad.test.ts`                                                                                                      | Play Riding Nomad and attack a spent rival unit same turn.       | Riding Nomad can attack rival units on played turn, direct attack remains illegal unless allowed by effect.     |
| `unitRoyceDonTCallMeSimonHighCred`  | `packages/engine/src/cards/spoiler/units/royce-don-t-call-me-simon.test.ts`, `apps/multi-game-simulator/src/games/cyberpunk/engine/__tests__/scenarios.test.ts`     | Play Royce and choose target.                                    | P1 Street Cred > P2 exposes power <= 3 rival targets, Armored Minotaur is excluded, selected unit defeated.     |
| `unitRoyceDonTCallMeSimonLowCred`   | `packages/engine/src/cards/spoiler/units/royce-don-t-call-me-simon.test.ts`                                                                                         | Play Royce and choose target.                                    | P1 Street Cred <= P2 exposes only power <= 2 rival targets, higher-power units are excluded.                    |
| `unitSandayuOdaHanakoSGuardian`     | `packages/engine/src/cards/spoiler/units/sandayu-oda-hanako-s-guardian.test.ts`, `apps/multi-game-simulator/src/games/cyberpunk/engine/__tests__/scenarios.test.ts` | Play Sandayu, select two rival units, then attack a spent unit.  | Two friendly value-pairs require two targets, both rivals spend, Sandayu can attack rival units on played turn. |

## Implementation Order

1. Build the shared behavior interface and runner helpers.
2. Extend the shared POM with missing semantic actions and state reads.
3. Implement core fixture behaviors.
4. Implement program fixture behaviors.
5. Implement gear fixture behaviors.
6. Implement legend fixture behaviors.
7. Implement unit fixture behaviors.
8. Generate the one-file-per-fixture jsdom wrappers.
9. Generate the one-file-per-fixture Playwright wrappers.
10. Run focused validation after each group.

## Validation Commands

Run fast jsdom coverage first:

```sh
vp test run src/testing/fixtures/jsdom/*.test.tsx
```

Run focused Playwright coverage:

```sh
pnpm exec playwright test e2e/specs/root-fixtures --project=chromium
```

Run type checks:

```sh
pnpm exec tsc --noEmit
pnpm exec tsc -p e2e/tsconfig.json --pretty false
```

Run whitespace check from repository root:

```sh
git diff --check
```

## Notes For The Implementing Agent

- Keep each fixture behavior small and direct. Do not turn each simulator test into a full engine test suite.
- If a fixture is intentionally visual/static, document that in its behavior file and assert the rendered state that matters.
- If jsdom and Playwright disagree, prefer fixing the shared POM/driver abstraction over adding runner-specific behavior.
- If a behavior exposes a real simulator or fixture bug, keep the failing test and fix the bug. Do not skip unless it is clearly unrelated infrastructure noise.
- Preserve game-agnostic boundaries. Cyberpunk fixture behavior should stay inside the Cyberpunk simulator package.
- Do not add loose `any` or broad `unknown` escape hatches. Model the small engine handle surface needed by the POM.
