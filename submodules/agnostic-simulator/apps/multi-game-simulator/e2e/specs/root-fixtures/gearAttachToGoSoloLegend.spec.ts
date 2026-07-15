import { test } from "@playwright/test";

import {
  welcomeToNightCityRetailMantisBlades,
  theHeistRetailStarterDeckVCorporateExile,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Mantis Blades - attach to a GO SOLO legend on field", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/gearAttachToGoSoloLegend?ai=off&auto-advance-attack=off",
  );

  const pom = await createPlaywrightCyberpunkSimulatorPom(page);

  const gear = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailMantisBlades.id,
  );
  const goSoloLegend = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    theHeistRetailStarterDeckVCorporateExile.id,
  );

  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectEddies(CYBERPUNK_P1, 3);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goSoloLegend.instanceId, 8);

  await pom.attachGearFromHand(gear.instanceId, goSoloLegend.instanceId, CYBERPUNK_P1);

  await pom.expectHandSize(CYBERPUNK_P1, 0);
  await pom.expectEddies(CYBERPUNK_P1, 2);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, goSoloLegend.instanceId, 1);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goSoloLegend.instanceId, 10);

  await pom.expectStructuralState();
});
