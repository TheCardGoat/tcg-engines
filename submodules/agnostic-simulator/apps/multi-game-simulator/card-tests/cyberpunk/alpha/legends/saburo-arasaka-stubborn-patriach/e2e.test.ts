import { test } from "@playwright/test";

import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendSaburoArasakaStubbornPatriach } from "@cyberpunk/testing/e2e-fixtures";

test("Saburo Arasaka - Arasaka attacker power", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendSaburoArasakaStubbornPatriach,
  );

  const minotaur = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaArmoredMinotaur.id,
  );
  const lowlife = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaRuthlessLowlife.id,
  );
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, minotaur.instanceId, 9);
  await pom.attackUnit(minotaur.instanceId, defender.instanceId, CYBERPUNK_P1);

  const attack = expectDefined("Saburo attack state", await pom.getAttackState());
  expectEqual("Saburo attack kind", attack.kind, "fight");
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, minotaur.instanceId, 10);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, lowlife.instanceId, 1);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, minotaur.instanceId, true);

  await pom.expectStructuralState();
});
