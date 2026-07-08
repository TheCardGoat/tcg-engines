import { test } from "@playwright/test";

import {
  welcomeToNightCityRetailCorpoSecurity,
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { legendEmbracingGoroTakemuraHandsUnclean } from "@cyberpunk/testing/e2e-fixtures";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Goro Takemura (Embracing Power) - GO SOLO with BLOCKER", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendEmbracingGoroTakemuraHandsUnclean,
  );
  const goro = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.id,
  );
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );

  await pom.goSolo(goro.instanceId, CYBERPUNK_P1);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, goro.instanceId, "blocker", true);
  await pom.attackUnit(goro.instanceId, defender.instanceId, CYBERPUNK_P1);

  const attack = expectDefined("Embracing Goro attack state", await pom.getAttackState());
  expectEqual("Embracing Goro attack kind", attack.kind, "fight");
  await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, true);
  await pom.expectStructuralState();
});
