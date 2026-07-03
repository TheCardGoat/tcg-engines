// @vitest-environment jsdom

import { describe, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
  welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailSaulBrightStormrider,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../../../cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../../../render-cyberpunk-simulator";

describe("PR 2295 retail cards visual fixture", () => {
  test("renders all new PR 2295 cards on the simulator board", async () => {
    ensureJsdomAnimationSupport();
    window.matchMedia ??= () =>
      ({
        matches: false,
        media: "",
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
    globalThis.ResizeObserver ??= class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };

    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailPr2295Cards" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailLaLloronaGhostOfThePast.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSaulBrightStormrider.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMoxInciters.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailOverwatchPanamSGift.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailYorinobuArasakaSteelDragon.id,
      );
    } finally {
      view.unmount();
    }
  });
});
