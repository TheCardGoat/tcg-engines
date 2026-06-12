import { describe, test } from "vite-plus/test";
import { alphaDyingNightVSPistol, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Jackie Welles - Pour One Out For Me (Retail) jsdom happy path", () => {
  test("decreases a Gig after blue gear is played", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendJackieWellesPourOneOutForMeRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const gear = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaDyingNightVSPistol.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const gig = (await pom.getGigDice(CYBERPUNK_P1))[0]!;

      await pom.expectGigValue(gig.id, 2);
      await pom.attachGearFromHand(gear.instanceId, host.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveAdjustGig(1, CYBERPUNK_P1);

      // Retail Jackie decreases a friendly Gig by up to 2.
      // d4 starts at 2, decreases to 1 (min for d4).
      await pom.expectGigValue(gig.id, 1);
      await pom.expectEddies(CYBERPUNK_P1, 2);
      // Hand: Floor It remains after playing Dying Night.
      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      expectEqual("Jackie deck without draw", await pom.getDeckSize(CYBERPUNK_P1), 38);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
