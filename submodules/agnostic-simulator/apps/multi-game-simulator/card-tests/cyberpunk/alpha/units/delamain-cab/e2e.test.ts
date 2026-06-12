import { test } from "@playwright/test";

import { alphaDelamainCab } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitDelamainCab } from "@cyberpunk/testing/e2e-fixtures";

test("Delamain Cab - renders at printed power and starts a direct attack", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitDelamainCab);

  const delamain = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaDelamainCab.id,
  );

  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, delamain.instanceId, 7);
  await pom.attackRival(delamain.instanceId, CYBERPUNK_P1);

  const attack = await pom.getAttackState();
  if (!attack || attack.kind !== "direct") {
    throw new Error("Expected Delamain Cab to start a direct attack.");
  }

  await pom.expectFieldCardSpent(CYBERPUNK_P1, delamain.instanceId, true);
  await pom.expectStructuralState();
});
