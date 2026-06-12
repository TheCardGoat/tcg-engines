import { describe, test } from "vite-plus/test";
import { alphaRebootOptics, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Reboot Optics jsdom happy path", () => {
  test("buffs the selected friendly unit and trashes the Program", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progRebootOptics" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const program = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaRebootOptics.id,
      );
      const swordwise = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      await pom.resolveEffectTarget([swordwise.instanceId], CYBERPUNK_P1);

      await pom.expectRenderedFieldCardPower(CYBERPUNK_P1, swordwise.instanceId, 9);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, alphaRebootOptics.id);
    } finally {
      view.unmount();
    }
  });
});
