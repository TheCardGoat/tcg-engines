import { test } from "@playwright/test";

import {
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailPanamPalmerNomadCavalry,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendPanamPalmerNomadCavalryRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Panam Palmer (Retail) - spend moves gear to field", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendPanamPalmerNomadCavalryRetail,
  );

  const panam = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    welcomeToNightCityRetailPanamPalmerNomadCavalry.id,
  );

  const unit = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );

  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, unit.instanceId, 0);

  await pom.activateAbility(panam.instanceId, 0, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const gearChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  if (gearChoices.length !== 1) {
    throw new Error(
      `Expected Panam to offer exactly one attached Gear, got ${gearChoices.length}.`,
    );
  }
  await pom.resolveEffectTarget([gearChoices[0]!], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectLegendCardSpent(CYBERPUNK_P1, panam.instanceId, true);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, unit.instanceId, 1);

  await pom.expectStructuralState();
});
