import { test } from "@playwright/test";

import { alphaCorpoSecurity, alphaGoroTakemuraHandsUnclean } from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Goro Takemura - Hands Unclean - GO SOLO + BLOCKER", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/legendGoroTakemuraHandsUnclean?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const goro = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    alphaGoroTakemuraHandsUnclean.id,
  );
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  await pom.goSolo(goro.instanceId, CYBERPUNK_P1);

  await pom.expectEddies(CYBERPUNK_P1, 1);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, false);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 7);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, goro.instanceId, "goSolo", true);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, goro.instanceId, "blocker", true);

  await pom.attackUnit(goro.instanceId, defender.instanceId, CYBERPUNK_P1);

  const attack = expectDefined("Goro attack state", await pom.getAttackState());
  expectEqual("Goro attack kind", attack.kind, "fight");
  await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, true);

  await pom.expectStructuralState();
});
