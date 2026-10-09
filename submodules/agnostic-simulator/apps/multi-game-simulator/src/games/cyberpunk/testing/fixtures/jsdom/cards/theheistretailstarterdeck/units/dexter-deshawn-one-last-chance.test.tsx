import { describe, expect, test } from "vite-plus/test";
import { theHeistRetailStarterDeckDexterDeshawnOneLastChance } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectIncludes } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Dexter DeShawn - One Last Chance (The Heist) jsdom behavior", () => {
  test("play trigger prompts for a Gig and adjusts it", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitTheHeistDexterDeshawnOneLastChance",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const dexter = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        theHeistRetailStarterDeckDexterDeshawnOneLastChance.id,
      );
      const gig = (await pom.getGigDice(CYBERPUNK_P1))[0]!;

      await pom.playCardFromHand(dexter.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const prompt = view.container.querySelector('[data-testid="prompt-banner"]');
      const optionalIcon = prompt?.querySelector(
        '[data-testid="prompt-banner-message"][role="img"]',
      );
      // The requirement lives on the intent icon (tooltip + aria-label), not
      // as a visible badge.
      expect(optionalIcon?.getAttribute("aria-label")).toContain("Optional effect");
      expect(optionalIcon?.getAttribute("aria-label")).toContain("Choose up to 1 target");
      expect(optionalIcon?.hasAttribute("title")).toBe(false);
      expectIncludes("Dexter eligible Gig", await pom.getEligibleTargetIds(CYBERPUNK_P1), gig.id);
      await pom.resolveAdjustGig(gig.id, 3, CYBERPUNK_P1);

      await pom.expectGigValue(gig.id, 3);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
