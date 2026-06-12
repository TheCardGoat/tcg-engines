import { test } from "@playwright/test";

import { alphaCorpoSecurity, alphaVCorporateExile } from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("V - Corporate Exile - GO SOLO", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/legendVCorporateExile?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const v = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    alphaVCorporateExile.id,
  );
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  await pom.expectEddies(CYBERPUNK_P1, 6);
  await pom.goSolo(v.instanceId, CYBERPUNK_P1);

  await pom.expectEddies(CYBERPUNK_P1, 1);
  await pom.expectFieldSize(CYBERPUNK_P1, 2);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, v.instanceId, false);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, v.instanceId, 8);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, v.instanceId, "goSolo", true);

  await pom.attackUnit(v.instanceId, defender.instanceId, CYBERPUNK_P1);

  const attack = expectDefined("V attack state", await pom.getAttackState());
  expectEqual("V attack kind", attack.kind, "fight");
  await pom.expectFieldCardSpent(CYBERPUNK_P1, v.instanceId, true);

  await pom.expectStructuralState();
});
