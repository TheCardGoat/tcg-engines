import { describe, test } from "vite-plus/test";
import { alphaCorporateSurveillance, alphaCorpoSecurity } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Corporate Surveillance jsdom happy path", () => {
  test("spends the clicked rival low-cost unit and leaves the other target ready", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progCorporateSurveillance" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const program = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaCorporateSurveillance.id,
      );
      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Corporate Surveillance eligible targets", eligible.length, 2);
      await pom.resolveEffectTarget([eligible[0]!], CYBERPUNK_P1);

      const corpos = await pom.getCardsInZone("field", CYBERPUNK_P2);
      expectEqual(
        "spent Corpo Security count",
        corpos.filter((card) => card.definitionId === alphaCorpoSecurity.id && card.spent).length,
        1,
      );
      expectEqual(
        "ready Corpo Security count",
        corpos.filter((card) => card.definitionId === alphaCorpoSecurity.id && !card.spent).length,
        1,
      );
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, alphaCorporateSurveillance.id);
    } finally {
      view.unmount();
    }
  });
});
