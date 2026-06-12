import { describe, test } from "vite-plus/test";
import {
  spoilerRiverWardDetectiveOnTheHunt,
  welcomeToNightCityRetailChromeReverie,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Chrome Reverie (Retail) jsdom happy path", () => {
  test("play grants cantAttack then calls a legend for free", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progChromeReverieRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);

      const chrome = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailChromeReverie.id,
      );

      const legendBefore = await pom.getCardsInZone("legendArea", CYBERPUNK_P1);
      const faceDownLegend = legendBefore.find(
        (c) => c.definitionId === spoilerRiverWardDetectiveOnTheHunt.id,
      );
      expectEqual("Face-down legend exists", faceDownLegend !== undefined, true);

      await pom.playCardFromHand(chrome.instanceId, CYBERPUNK_P1);

      // First chooseTarget: grantRule cantAttack on rival unit
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible1 = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Chrome Reverie first eligible count", eligible1.length, 2);
      await pom.resolveEffectTarget([eligible1[0]!], CYBERPUNK_P1);

      // Second chooseTarget: callLegend for free
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible2 = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Chrome Reverie second eligible count", eligible2.length, 1);
      await pom.resolveEffectTarget([eligible2[0]!], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, eddiesBefore - 3);
      // Legend was called for free (face-up now) — one fewer face-down legend
      await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);
      // Chrome Reverie goes to trash
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailChromeReverie.id,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
