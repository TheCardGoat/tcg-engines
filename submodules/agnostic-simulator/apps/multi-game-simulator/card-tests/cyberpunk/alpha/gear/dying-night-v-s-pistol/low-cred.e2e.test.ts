import { test } from "@playwright/test";

import {
  alphaCorpoSecurity,
  alphaKiroshiOptics,
  alphaTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Dying Night - low Street Cred does not defeat gear", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/gearDyingNightLowCred?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaTBugAmateurPhilosopher.id,
  );
  const rivalHost = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  expectEqual("Dying Night low-cred Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 4);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

  await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectTrashSize(CYBERPUNK_P2, 0);
  await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P2, alphaKiroshiOptics.id);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

  await pom.expectStructuralState();
});
