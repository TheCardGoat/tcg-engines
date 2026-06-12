import { describe, test } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailWraithMarauders,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Wraith Marauders (Retail) jsdom happy path", () => {
  test("wraith Marauders (Retail) - steals gig and readies matching-power unit", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitWraithMaraudersRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const wraith = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailWraithMarauders.id,
      );
      const swordwise = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaArmoredMinotaur.id,
      );

      await pom.attackRival(wraith.instanceId, CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
      expectEqual("Wraith Marauders eligible target count", eligible.length, 1);
      expectIncludes(
        "Wraith Marauders eligible targets",
        eligibleDefinitions,
        alphaSwordwiseHuscle.id,
      );
      if (eligibleDefinitions.includes(alphaArmoredMinotaur.id)) {
        throw new Error("Expected Armored Minotaur not to be eligible for Wraith Marauders ready.");
      }

      await pom.resolveEffectTarget([swordwise.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, swordwise.instanceId, false);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, minotaur.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
