import { describe, test } from "vite-plus/test";
import { alphaJackieWellesRideOrDieChoom } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Jackie Welles - Ride Or Die Choom jsdom happy path", () => {
  test("renders +2 power per friendly Gig", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitJackieWellesRideOrDieChoom" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const jackie = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaJackieWellesRideOrDieChoom.id,
      );

      await pom.expectGigCount(CYBERPUNK_P1, 3);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, jackie.instanceId, 12);
    } finally {
      view.unmount();
    }
  });
});
