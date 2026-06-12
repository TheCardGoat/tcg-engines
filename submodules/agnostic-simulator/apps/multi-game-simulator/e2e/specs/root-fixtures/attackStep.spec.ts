import { test } from "@playwright/test";

import { alphaJackieWellesRideOrDieChoom, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Main phase - attackers ready", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/attackStep?ai=off&auto-advance-attack=off");

  const pom = await createPlaywrightCyberpunkSimulatorPom(page);

  expectEqual("attackStep phase", await pom.getPhase(), "main");
  expectEqual("attackStep active player", await pom.getActivePlayerId(), CYBERPUNK_P1);
  await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
  await pom.expectBoardMode(CYBERPUNK_P2, "view");
  await pom.expectFieldSize(CYBERPUNK_P1, 2);
  await pom.expectFieldSize(CYBERPUNK_P2, 2);

  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaJackieWellesRideOrDieChoom.id,
  );
  await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, false);
  await pom.expectFieldCardSpent(CYBERPUNK_P2, defender.instanceId, true);

  await pom.attackUnit(attacker.instanceId, defender.instanceId, CYBERPUNK_P1);

  const attack = await pom.getAttackState();
  if (!attack) {
    throw new Error("Expected attack state after attacking a spent unit.");
  }
  expectEqual("attack kind", attack.kind, "fight");
  expectEqual("attack step", attack.step, "offensive");
  expectEqual("attack attacker", attack.attackerId, attacker.instanceId);
  expectEqual("attack defender", attack.defenderId, defender.instanceId);
  expectEqual("attack rival", attack.rivalId, CYBERPUNK_P2);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, true);

  await pom.expectStructuralState();
});
