import { test } from "@playwright/test";

import { welcomeToNightCityRetailEvelynParkerBeautifulEnigma } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendEvelynParkerBeautifulEnigmaRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Evelyn Parker (Retail) - renders face-up in the legend area", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendEvelynParkerBeautifulEnigmaRetail,
  );

  await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    welcomeToNightCityRetailEvelynParkerBeautifulEnigma.id,
  );

  await pom.expectStructuralState();
});
