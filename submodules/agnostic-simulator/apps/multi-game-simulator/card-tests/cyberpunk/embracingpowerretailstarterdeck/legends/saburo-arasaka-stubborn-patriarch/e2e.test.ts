import { test } from "@playwright/test";

import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { legendEmbracingSaburoArasakaStubbornPatriarch } from "@cyberpunk/testing/e2e-fixtures";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Saburo Arasaka (Embracing Power) - buffs Arasaka attacker", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendEmbracingSaburoArasakaStubbornPatriarch,
  );
  const minotaur = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    embracingPowerRetailStarterDeckMinotaur.id,
  );
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );

  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, minotaur.instanceId, 9);
  await pom.attackUnit(minotaur.instanceId, defender.instanceId, CYBERPUNK_P1);

  expectEqual("Saburo attack kind", (await pom.getAttackState())?.kind, "fight");
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, minotaur.instanceId, 10);
  await pom.expectStructuralState();
});
