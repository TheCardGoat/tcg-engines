import { describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailOctant } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Octant (Retail) jsdom", () => {
  test("plays for 5 €$ with two friendly 8+ Gigs", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitOctantRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const octant = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailOctant.id,
      );
      await pom.playCardFromHand(octant.instanceId, CYBERPUNK_P1);
      await pom.expectEddies(CYBERPUNK_P1, 0);
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailOctant.id,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
