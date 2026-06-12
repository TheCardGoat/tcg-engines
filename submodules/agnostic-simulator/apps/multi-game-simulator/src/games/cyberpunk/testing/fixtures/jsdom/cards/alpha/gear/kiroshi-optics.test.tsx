import { describe, test } from "vite-plus/test";
import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Kiroshi Optics jsdom happy path", () => {
  test("peeks at a face-down friendly legend without revealing it", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearKiroshiOptics" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );

      await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 2);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 6);

      await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Kiroshi face-down legend target count", eligible.length, 2);
      const legendTarget = eligible[0];
      if (!legendTarget) {
        throw new Error("Expected Kiroshi Optics to expose a legend target.");
      }

      await pom.resolveEffectTarget([legendTarget], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 2);
      await pom.getCardInZoneByInstanceId("legendArea", CYBERPUNK_P1, legendTarget);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
