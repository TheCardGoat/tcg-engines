import { describe, test } from "vite-plus/test";
import { alphaSecondhandBombus } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Secondhand Bombus jsdom happy path", () => {
  test("redirects a rival direct attack as BLOCKER", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitSecondhandBombus" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const bombus = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSecondhandBombus.id,
      );

      await pom.useBlocker(bombus.instanceId, CYBERPUNK_P1);

      await pom.expectFieldCardSpent(CYBERPUNK_P1, bombus.instanceId, true);
      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Secondhand Bombus to redirect the active attack.");
      }
      expectEqual("Secondhand Bombus attack kind", attack.kind, "fight");
      expectEqual("Secondhand Bombus defender", attack.defenderId, bombus.instanceId);
    } finally {
      view.unmount();
    }
  });
});
