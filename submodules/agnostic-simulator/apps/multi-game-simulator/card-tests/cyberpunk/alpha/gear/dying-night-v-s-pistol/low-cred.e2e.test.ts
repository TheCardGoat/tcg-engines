import { test } from "@playwright/test";

import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { gearDyingNightLowCred } from "@cyberpunk/testing/e2e-fixtures";

test("Dying Night - low Street Cred does not defeat gear", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, gearDyingNightLowCred);

  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailTBugAmateurPhilosopher.id,
  );
  const rivalHost = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );

  expectEqual("Dying Night low-cred Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 4);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

  await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectTrashSize(CYBERPUNK_P2, 0);
  await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailKiroshiOptics.id,
  );
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

  await pom.expectStructuralState();
});
