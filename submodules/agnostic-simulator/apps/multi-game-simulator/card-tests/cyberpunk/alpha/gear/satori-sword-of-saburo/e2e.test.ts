import { test } from "@playwright/test";

import { alphaCorpoSecurity, alphaTBugAmateurPhilosopher } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { gearSatoriSwordOfSaburo } from "@cyberpunk/testing/e2e-fixtures";

test("Satori - draw after winning a fight", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, gearSatoriSwordOfSaburo);

  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaTBugAmateurPhilosopher.id,
  );
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 6);

  await pom.attackUnit(attacker.instanceId, defender.instanceId, CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);

  expectEqual("Satori attack cleared", await pom.getAttackState(), null);
  await pom.expectHandSize(CYBERPUNK_P1, 2);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);

  await pom.expectStructuralState();
});
