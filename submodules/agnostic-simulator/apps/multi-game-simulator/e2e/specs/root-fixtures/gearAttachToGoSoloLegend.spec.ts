import { test } from "@playwright/test";

import { alphaMantisBlades, alphaVCorporateExile } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "../../poms/CyberpunkPlaywrightHarnessClient";

test("Mantis Blades - attach to a GO SOLO legend on field", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/gearAttachToGoSoloLegend?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const gear = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaMantisBlades.id);
  const goSoloLegend = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaVCorporateExile.id,
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
