import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("gearKiroshiOptics fixture behavior", () => {
  test("Kiroshi Optics - peek at a face-down legend in jsdom", async () => {
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
