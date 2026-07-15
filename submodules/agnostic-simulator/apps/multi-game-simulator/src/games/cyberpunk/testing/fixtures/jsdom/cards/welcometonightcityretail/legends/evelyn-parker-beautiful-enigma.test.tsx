import { describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailEvelynParkerBeautifulEnigma } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Evelyn Parker - Beautiful Enigma (Retail) jsdom happy path", () => {
  test("renders face-up in the legend area", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendEvelynParkerBeautifulEnigmaRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailEvelynParkerBeautifulEnigma.id,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
