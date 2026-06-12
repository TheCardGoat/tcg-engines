import { test } from "@playwright/test";

import { alphaTBugAmateurPhilosopher } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitTBugAmateurPhilosopher } from "@cyberpunk/testing/e2e-fixtures";

test("T-Bug - Amateur Philosopher - renders at printed power and starts a direct attack", async ({
  page,
}) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitTBugAmateurPhilosopher);

  const tbug = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaTBugAmateurPhilosopher.id,
  );

  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, tbug.instanceId, 5);
  await pom.attackRival(tbug.instanceId, CYBERPUNK_P1);

  const attack = await pom.getAttackState();
  if (!attack || attack.kind !== "direct") {
    throw new Error("Expected T-Bug to start a direct attack.");
  }

  await pom.expectFieldCardSpent(CYBERPUNK_P1, tbug.instanceId, true);
  await pom.expectStructuralState();
});
