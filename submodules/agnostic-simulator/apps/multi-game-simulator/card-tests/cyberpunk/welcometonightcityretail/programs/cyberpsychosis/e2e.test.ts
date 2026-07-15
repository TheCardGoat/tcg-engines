import { test } from "@playwright/test";

import {
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailCyberpsychosis,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progCyberpsychosisRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Cyberpsychosis (Retail) - equipped unit with gears is present", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progCyberpsychosisRetail);

  await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailCyberpsychosis.id,
  );

  const unit = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailSwordwiseHuscle.id,
  );
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, unit.instanceId, 2);
  await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailKiroshiOptics.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailMantisBlades.id,
  );

  await pom.expectStructuralState();
});
