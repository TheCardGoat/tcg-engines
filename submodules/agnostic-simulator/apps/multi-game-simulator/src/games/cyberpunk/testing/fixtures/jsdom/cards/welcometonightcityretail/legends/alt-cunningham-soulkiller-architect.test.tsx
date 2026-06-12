import { describe, test } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Alt Cunningham - Soulkiller Architect (Retail) jsdom happy path", () => {
  test("spends to play a Program from trash", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendAltCunninghamSoulkillerArchitectRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const alt = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAltCunninghamSoulkillerArchitect.id,
      );

      await pom.activateAbility(alt.instanceId, 1, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");
      const playChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
      expectEqual("Alt Cunningham play choices count", playChoices.length, 1);
      await pom.resolveCardToPlay(playChoices[0]!, CYBERPUNK_P1);

      // Corporate Surveillance PLAY trigger: spend a rival unit with cost 3 or less
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const spendEligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Corporate Surveillance eligible spend targets", spendEligible.length, 1);
      await pom.resolveEffectTarget([spendEligible[0]!], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, 5); // 8 - 1 (Alt) - 2 (Corporate Surveillance)
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, alphaCorporateSurveillance.id);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
