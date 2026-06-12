import { test } from "@playwright/test";

import { alphaCorpoSecurity, spoilerElSombreronLaVenganzaLenta } from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("El Sombreron - attack trigger doubles fight power", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/unitElSombreronLaVenganzaLenta?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const elSombreron = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    spoilerElSombreronLaVenganzaLenta.id,
  );
  const target = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  await pom.attackUnit(elSombreron.instanceId, target.instanceId, CYBERPUNK_P1);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, elSombreron.instanceId, 8);

  const attack = await pom.getAttackState();
  if (!attack) {
    throw new Error("Expected El Sombreron to start a fight.");
  }
  expectEqual("El Sombreron attack kind", attack.kind, "fight");
  expectEqual("El Sombreron attack defender", attack.defenderId, target.instanceId);

  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);

  expectEqual("El Sombreron resolved attack", await pom.getAttackState(), null);
  await pom.expectFieldSize(CYBERPUNK_P1, 1);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);

  await pom.expectStructuralState();
});
