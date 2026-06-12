import { test } from "@playwright/test";

import { welcomeToNightCityRetailDumDumMaelstromTriggerman } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendDumDumMaelstromTriggermanRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Dum Dum (Retail) - call draws at least one card", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendDumDumMaelstromTriggermanRetail,
  );

  const dumDum = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    welcomeToNightCityRetailDumDumMaelstromTriggerman.id,
  );

  const handBefore = await pom.getHandSize(CYBERPUNK_P1);

  await pom.callLegend(dumDum.instanceId, CYBERPUNK_P1);

  await pom.resolveCardToMovePass(CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore + 1);
  await pom.expectStructuralState();
});
