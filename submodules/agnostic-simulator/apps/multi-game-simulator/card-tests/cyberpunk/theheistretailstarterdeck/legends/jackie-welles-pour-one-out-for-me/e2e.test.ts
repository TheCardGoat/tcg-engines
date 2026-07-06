import { test } from "@playwright/test";

import {
  alphaDyingNightVSPistol,
  alphaSwordwiseHuscle,
  theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { legendTheHeistJackieWellesPourOneOutForMe } from "@cyberpunk/testing/e2e-fixtures";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Jackie Welles (The Heist) - blue Gear prompts Gig decrease", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendTheHeistJackieWellesPourOneOutForMe,
  );
  await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    theHeistRetailStarterDeckJackieWellesPourOneOutForMe.id,
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

  await pom.attachGearFromHand(gear.instanceId, host.instanceId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  await pom.resolveAdjustGig(1, CYBERPUNK_P1);

  await pom.expectGigValue(gig.id, 1);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
  expectEqual("The Heist Jackie deck after min-Gig draw", await pom.getDeckSize(CYBERPUNK_P1), 37);
  await pom.expectStructuralState();
});
