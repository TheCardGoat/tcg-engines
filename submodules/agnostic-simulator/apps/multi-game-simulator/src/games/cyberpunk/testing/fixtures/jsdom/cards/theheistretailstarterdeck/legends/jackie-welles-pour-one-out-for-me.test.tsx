import { describe, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailSwordwiseHuscle,
  theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Jackie Welles - Pour One Out For Me (The Heist) jsdom behavior", () => {
  test("prompts after a blue Gear is played and decreases a friendly Gig", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendTheHeistJackieWellesPourOneOutForMe",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        theHeistRetailStarterDeckJackieWellesPourOneOutForMe.id,
      );
      const gear = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDyingNightVSPistol.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      const gig = (await pom.getGigDice(CYBERPUNK_P1))[0]!;

      await pom.attachGearFromHand(gear.instanceId, host.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveAdjustGig(1, CYBERPUNK_P1);

      await pom.expectGigValue(gig.id, 1);
      await pom.expectHandSize(CYBERPUNK_P1, 2);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);

      const floorIt = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailFloorIt.id,
      );
      await pom.playCardFromHand(floorIt.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const corpo = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      await pom.resolveEffectTarget([corpo.instanceId], CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectGigValue(gig.id, 1);

      expectEqual(
        "The Heist Jackie deck after min-Gig draw",
        await pom.getDeckSize(CYBERPUNK_P1),
        36,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("blue Program first does not consume the first blue Unit/Gear trigger", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendQaBlueSetup",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const gig = (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d4");
      if (!gig) {
        throw new Error("Expected D4 friendly Gig in legendQaBlueSetup.");
      }

      const floorIt = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailFloorIt.id,
      );
      await pom.playCardFromHand(floorIt.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const corpo = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      await pom.resolveEffectTarget([corpo.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectGigValue(gig.id, 2);

      const gear = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDyingNightVSPistol.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      await pom.attachGearFromHand(gear.instanceId, host.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveAdjustGig(1, CYBERPUNK_P1);

      await pom.expectGigValue(gig.id, 1);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
