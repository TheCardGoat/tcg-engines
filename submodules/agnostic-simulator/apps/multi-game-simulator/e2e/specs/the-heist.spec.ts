import { test } from "@playwright/test";

import {
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailTheHeist,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test.describe("The Heist - e2e", () => {
  test("trashes 4, selects a Gear from among them, and adds it to hand", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/progTheHeist?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    expectEqual("phase", await pom.getPhase(), "main");
    expectEqual("active player", await pom.getActivePlayerId(), CYBERPUNK_P1);

    const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);
    const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);
    const program = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      welcomeToNightCityRetailTheHeist.id,
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    // Cost 2 paid, then the Program and the four milled cards are in trash
    // while the player chooses which Gear to recover.
    expectEqual("eddies after play", await pom.getEddies(CYBERPUNK_P1), eddiesBefore - 2);
    await pom.expectTrashSize(CYBERPUNK_P1, 5);

    // 4 cards were milled from deck.
    expectEqual("deck after trash", await pom.getDeckSize(CYBERPUNK_P1), deckBefore - 4);

    // Gear selection from among the 4 trashed cards.
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    // Deck top 4: KiroshiOptics (Gear), CorpoSecurity, SwordwiseHuscle, MantisBlades (Gear)
    expectEqual("trashed-gear eligible count", eligible.length, 2);

    // Pick Kiroshi Optics.
    const kiroshiOpticsView = await pom.getCardView(
      { definitionId: welcomeToNightCityRetailKiroshiOptics.id },
      CYBERPUNK_P1,
    );
    if (!eligible.includes(kiroshiOpticsView.instanceId)) {
      throw new Error("Expected Kiroshi Optics to be among the eligible trashed Gears.");
    }
    await pom.resolveEffectTarget([kiroshiOpticsView.instanceId], CYBERPUNK_P1);

    // Gear lands in hand.
    await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    // No free-play prompt: no friendly Gig value matches the Gear cost.
    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectStructuralState();
  });

  test("free-play prompt appears when Gear cost matches a friendly Gig value", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/progTheHeistFreePlay?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);
    const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);
    const program = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      welcomeToNightCityRetailTheHeist.id,
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    expectEqual("eddies after play", await pom.getEddies(CYBERPUNK_P1), eddiesBefore - 2);
    expectEqual("deck after trash", await pom.getDeckSize(CYBERPUNK_P1), deckBefore - 4);

    // Step 1: pick the Gear from among the trashed cards.
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    // Deck top 4: MantisBlades (Gear, cost 1), CorpoSecurity, SwordwiseHuscle, KiroshiOptics (Gear)
    expectEqual("trashed-gear eligible count", eligible.length, 2);

    const mantisBladesView = await pom.getCardView(
      { definitionId: welcomeToNightCityRetailMantisBlades.id },
      CYBERPUNK_P1,
    );
    if (!eligible.includes(mantisBladesView.instanceId)) {
      throw new Error("Expected Mantis Blades to be among the eligible trashed Gears.");
    }
    await pom.resolveEffectTarget([mantisBladesView.instanceId], CYBERPUNK_P1);

    // Step 2: the recovered Gear is fixed. The prompt should target the
    // friendly Unit that will receive it, rather than showing the Gear again.
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const freePlayEligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const secondhandBombus = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      welcomeToNightCityRetailSecondhandBombus.id,
    );
    expectEqual("free-play attachment-host count", freePlayEligible.length, 1);
    if (!freePlayEligible.includes(secondhandBombus.instanceId)) {
      throw new Error("Expected Secondhand Bombus to be the free-play attachment host.");
    }

    await pom.resolveEffectTarget([secondhandBombus.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, secondhandBombus.instanceId, 1);
    await pom.expectStructuralState();
  });
});
