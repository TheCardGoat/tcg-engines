import { test } from "@playwright/test";

import { alphaEmergencyAtlus } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitEmergencyAtlus } from "@cyberpunk/testing/e2e-fixtures";

test("Emergency Atlus - renders at printed power and starts a direct attack", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitEmergencyAtlus);

  const atlus = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaEmergencyAtlus.id,
  );

  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, atlus.instanceId, 7);
  await pom.attackRival(atlus.instanceId, CYBERPUNK_P1);

  const attack = await pom.getAttackState();
  if (!attack || attack.kind !== "direct") {
    throw new Error("Expected Emergency Atlus to start a direct attack.");
  }

  await pom.expectFieldCardSpent(CYBERPUNK_P1, atlus.instanceId, true);
  await pom.expectStructuralState();
});
