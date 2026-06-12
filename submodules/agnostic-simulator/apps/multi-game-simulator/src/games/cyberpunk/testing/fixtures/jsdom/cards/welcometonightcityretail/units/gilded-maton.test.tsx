import { describe, test } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaKiroshiOptics,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailGildedMatoN,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Gilded Maton (Retail) jsdom happy path", () => {
  test("gilded Maton (Retail) - defeats friendly gear to defeat cheap rival unit", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitGildedMatonRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const maton = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailGildedMatoN.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const gear = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaKiroshiOptics.id,
      );
      const cheapTarget = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      await pom.playCardFromHand(maton.instanceId, CYBERPUNK_P1);

      // Gilded Maton play trigger: defeat friendly Gear to defeat a low-cost rival Unit.
      // The engine presents this as a sequence of choices; we resolve them interactively.
      const pending = await pom.getPendingChoiceType(CYBERPUNK_P1);
      if (pending === "chooseCardToMove") {
        const gearChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
        expectIncludes("Gilded Maton gear choices", gearChoices, gear.instanceId);
        await pom.resolveCardToMove(gear.instanceId, CYBERPUNK_P1);
      }

      if ((await pom.getPendingChoiceType(CYBERPUNK_P1)) === "chooseTarget") {
        const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
        const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
        expectIncludes("Gilded Maton eligible targets", eligibleDefinitions, alphaCorpoSecurity.id);
        expectExcludes(
          "Gilded Maton eligible targets",
          eligibleDefinitions,
          alphaArmoredMinotaur.id,
        );
        await pom.resolveEffectTarget([cheapTarget.instanceId], CYBERPUNK_P1);
      }

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 0);
      await pom.expectFieldSize(CYBERPUNK_P1, 2);
      await pom.expectFieldSize(CYBERPUNK_P2, 1);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, alphaKiroshiOptics.id);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
