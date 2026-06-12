import { test } from "@playwright/test";

import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitSwordwiseHuscle } from "@cyberpunk/testing/e2e-fixtures";

test("Swordwise Huscle - renders at printed power and starts a direct attack", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitSwordwiseHuscle);

  const huscle = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );

  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, huscle.instanceId, 5);
  await pom.attackRival(huscle.instanceId, CYBERPUNK_P1);

  const attack = await pom.getAttackState();
  if (!attack || attack.kind !== "direct") {
    throw new Error("Expected Swordwise Huscle to start a direct attack.");
  }

  await pom.expectFieldCardSpent(CYBERPUNK_P1, huscle.instanceId, true);
  await pom.expectStructuralState();
});
