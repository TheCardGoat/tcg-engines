import { test } from "@playwright/test";

import {
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendGoroTakemuraVengefulBodyguardRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Goro Takemura (Retail) - spend ability resolves", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendGoroTakemuraVengefulBodyguardRetail,
  );

  const goro = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    welcomeToNightCityRetailGoroTakemuraVengefulBodyguard.id,
  );

  const unit = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );

  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, unit.instanceId, 5);

  await pom.activateAbility(goro.instanceId, 1, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectLegendCardSpent(CYBERPUNK_P1, goro.instanceId, true);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, unit.instanceId, "blocker", false);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, unit.instanceId, 5);

  await pom.expectStructuralState();
});
