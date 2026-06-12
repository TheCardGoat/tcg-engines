import { describe, test } from "vite-plus/test";
import { spoilerPeaceOffering } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Peace Offering jsdom happy path", () => {
  test("renders the Program scenario and starts its two-Gig choice", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progPeaceOffering" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const program = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        spoilerPeaceOffering.id,
      );
      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

      expectEqual(
        "Peace Offering choice",
        await pom.getPendingChoiceType(CYBERPUNK_P1),
        "chooseTarget",
      );
    } finally {
      view.unmount();
    }
  });
});
