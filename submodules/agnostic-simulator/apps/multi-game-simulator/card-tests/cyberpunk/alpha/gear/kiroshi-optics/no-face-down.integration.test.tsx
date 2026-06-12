import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("gearKiroshiOpticsNoFaceDown fixture behavior", () => {
  test("Kiroshi Optics - no face-down legends in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearKiroshiOpticsNoFaceDown" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );

      await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);

      await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

      if ((await pom.getPendingChoiceType(CYBERPUNK_P1)) === "chooseTarget") {
        throw new Error("Expected Kiroshi Optics to have no face-down legend target prompt.");
      }
      await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
