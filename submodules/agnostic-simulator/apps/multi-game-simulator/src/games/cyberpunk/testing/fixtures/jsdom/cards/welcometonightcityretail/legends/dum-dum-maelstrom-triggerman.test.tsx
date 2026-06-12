import { describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailDumDumMaelstromTriggerman } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Dum Dum - Maelstrom Triggerman (Retail) jsdom happy path", () => {
  test("call draws at least one card", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendDumDumMaelstromTriggermanRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const dumDum = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDumDumMaelstromTriggerman.id,
      );

      const handBefore = await pom.getHandSize(CYBERPUNK_P1);

      await pom.callLegend(dumDum.instanceId, CYBERPUNK_P1);

      // Pass on the optional gear-defeat choice to keep the test stable
      await pom.resolveCardToMovePass(CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectHandSize(CYBERPUNK_P1, handBefore + 1);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
