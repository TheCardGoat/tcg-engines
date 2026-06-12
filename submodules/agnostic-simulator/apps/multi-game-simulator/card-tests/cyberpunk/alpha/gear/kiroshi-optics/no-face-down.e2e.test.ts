import { test } from "@playwright/test";

import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Kiroshi Optics - no face-down legends", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/gearKiroshiOpticsNoFaceDown?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );

  await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);

  await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

  if ((await pom.getPendingChoiceType(CYBERPUNK_P1)) === "chooseTarget") {
    throw new Error("Expected Kiroshi Optics to have no face-down legend target prompt.");
  }
  await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);

  await pom.expectStructuralState();
});
