import { test } from "@playwright/test";

import { alphaDyingNightVSPistol, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendJackieWellesPourOneOutForMe } from "@cyberpunk/testing/e2e-fixtures";

test("Jackie Welles - blue gear increases a gig", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, legendJackieWellesPourOneOutForMe);

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

  await pom.expectGigValue(gig.id, 4);
  await pom.expectEddies(CYBERPUNK_P1, 2);
  await pom.expectHandSize(CYBERPUNK_P1, 2);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
  expectEqual("Jackie deck after max-gig draw", await pom.getDeckSize(CYBERPUNK_P1), 37);

  await pom.expectStructuralState();
});
