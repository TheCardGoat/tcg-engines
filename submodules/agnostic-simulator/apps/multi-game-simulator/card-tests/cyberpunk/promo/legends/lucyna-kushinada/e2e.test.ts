import { test, expect } from "@playwright/test";

import { promoLucynaKushinada } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendLucynaKushinada } from "@cyberpunk/testing/e2e-fixtures";

test("Lucyna Kushinada - renders face-down in legend area and can be called", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, legendLucynaKushinada);

  const lucyna = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    promoLucynaKushinada.id,
  );

  expect(lucyna.faceDown).toBe(true);
  await pom.callLegend(lucyna.instanceId, CYBERPUNK_P1);
  const lucynaAfter = await pom.getCardInZoneByInstanceId(
    "legendArea",
    CYBERPUNK_P1,
    lucyna.instanceId,
  );
  expect(lucynaAfter.faceDown).toBe(false);
  expect(lucynaAfter.spent).toBe(false);
  await pom.expectStructuralState();
});
