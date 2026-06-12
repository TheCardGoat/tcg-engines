import { test } from "@playwright/test";

import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Kiroshi Optics - peek at a face-down legend", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/gearKiroshiOptics?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );

  await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 2);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 6);

  await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Kiroshi face-down legend target count", eligible.length, 2);
  const legendTarget = eligible[0];
  if (!legendTarget) {
    throw new Error("Expected Kiroshi Optics to expose a legend target.");
  }

  await pom.resolveEffectTarget([legendTarget], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 2);
  await pom.getCardInZoneByInstanceId("legendArea", CYBERPUNK_P1, legendTarget);

  await pom.expectStructuralState();
});
