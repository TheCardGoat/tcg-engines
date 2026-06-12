import { test } from "@playwright/test";

import { alphaDyingNightVSPistol, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendJackieWellesPourOneOutForMeRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Jackie Welles (Retail) - blue gear increases a gig", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendJackieWellesPourOneOutForMeRetail,
  );

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

  // Retail Jackie decreases a friendly Gig by up to 2 (clamped at min).
  // d4 starts at 2, decreases to 1 (min for d4).
  await pom.expectGigValue(gig.id, 1);
  await pom.expectEddies(CYBERPUNK_P1, 2);
  // Hand: Floor It remains + 1 drawn because gig hit min value
  await pom.expectHandSize(CYBERPUNK_P1, 2);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
  expectEqual("Jackie deck after min-gig draw", await pom.getDeckSize(CYBERPUNK_P1), 37);

  await pom.expectStructuralState();
});
