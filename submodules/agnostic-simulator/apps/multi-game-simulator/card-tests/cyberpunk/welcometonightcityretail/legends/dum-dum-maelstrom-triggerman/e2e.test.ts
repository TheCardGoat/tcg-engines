import { test } from "@playwright/test";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { welcomeToNightCityRetailDumDumMaelstromTriggerman } from "@tcg/cyberpunk-cards";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendDumDumMaelstromTriggermanRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Dum Dum (Retail) - call draws at least one card", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendDumDumMaelstromTriggermanRetail,
  );

  const dumDum = await pom.getCardInZoneByIndex("legendArea", CYBERPUNK_P1, 0);

  const handBefore = await pom.getHandSize(CYBERPUNK_P1);

  await pom.callLegend(dumDum.instanceId, CYBERPUNK_P1);
  const calledDumDum = await pom.getCardInZoneByInstanceId(
    "legendArea",
    CYBERPUNK_P1,
    dumDum.instanceId,
  );
  expectEqual(
    "Dum Dum definition after call",
    calledDumDum.definitionId,
    welcomeToNightCityRetailDumDumMaelstromTriggerman.id,
  );

  await pom.resolveCardToMovePass(CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore + 1);
  await pom.expectStructuralState();
});
