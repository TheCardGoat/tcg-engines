import { test } from "@playwright/test";

import { theHeistRetailStarterDeckDexterDeshawnOneLastChance } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectIncludes } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { unitTheHeistDexterDeshawnOneLastChance } from "@cyberpunk/testing/e2e-fixtures";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Dexter DeShawn (The Heist) - play trigger adjusts a Gig", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    unitTheHeistDexterDeshawnOneLastChance,
  );
  const dexter = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    theHeistRetailStarterDeckDexterDeshawnOneLastChance.id,
  );
  const gig = (await pom.getGigDice(CYBERPUNK_P1))[0]!;

  await pom.playCardFromHand(dexter.instanceId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  expectIncludes("Dexter eligible Gig", await pom.getEligibleTargetIds(CYBERPUNK_P1), gig.id);
  await pom.resolveEffectTarget([gig.id], CYBERPUNK_P1);
  await pom.resolveAdjustGig(3, CYBERPUNK_P1);

  await pom.expectGigValue(gig.id, 3);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectStructuralState();
});
