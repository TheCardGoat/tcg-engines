import { test } from "@playwright/test";

import { alphaGoroTakemuraLosingHisWay } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitGoroTakemuraLosingHisWay } from "@cyberpunk/testing/e2e-fixtures";

test("Goro Takemura - power scales with face-up legends", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitGoroTakemuraLosingHisWay);

  const goro = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaGoroTakemuraLosingHisWay.id,
  );

  await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 7);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, false);

  await pom.attackRival(goro.instanceId, CYBERPUNK_P1);
  const attack = await pom.getAttackState();
  if (!attack) {
    throw new Error("Expected Goro to start a direct attack.");
  }
  expectEqual("Goro attack kind", attack.kind, "direct");
  expectEqual("Goro attack step", attack.step, "offensive");
  await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, true);

  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  const steal = await pom.getAttackState();
  if (!steal) {
    throw new Error("Expected Goro direct attack to reach the steal step.");
  }
  expectEqual("Goro steal step", steal.step, "steal");

  await pom.expectStructuralState();
});
