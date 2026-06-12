import { describe, test } from "vite-plus/test";
import { alphaEmergencyAtlus } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Emergency Atlus jsdom happy path", () => {
  test("renders at printed power and starts a direct attack", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitEmergencyAtlus" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const atlus = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaEmergencyAtlus.id,
      );

      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, atlus.instanceId, 7);
      await pom.attackRival(atlus.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      expectEqual("Emergency Atlus attack kind", attack?.kind, "direct");
      await pom.expectFieldCardSpent(CYBERPUNK_P1, atlus.instanceId, true);
    } finally {
      view.unmount();
    }
  });
});
