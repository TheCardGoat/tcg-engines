import { test } from "@playwright/test";

import { alphaArmoredMinotaur, alphaJackieWellesRideOrDieChoom } from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Jackie Welles - power scales with friendly gigs", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/unitJackieWellesRideOrDieChoom?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const jackie = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaJackieWellesRideOrDieChoom.id,
  );
  const minotaur = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaArmoredMinotaur.id,
  );

  await pom.expectGigCount(CYBERPUNK_P1, 3);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, jackie.instanceId, 12);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, jackie.instanceId, false);

  await pom.attackUnit(jackie.instanceId, minotaur.instanceId, CYBERPUNK_P1);
  const attack = await pom.getAttackState();
  if (!attack) {
    throw new Error("Expected Jackie to start a fight.");
  }
  expectEqual("Jackie attack kind", attack.kind, "fight");
  expectEqual("Jackie attack defender", attack.defenderId, minotaur.instanceId);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, jackie.instanceId, 12);

  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);

  expectEqual("Jackie attack cleared", await pom.getAttackState(), null);
  await pom.expectFieldSize(CYBERPUNK_P1, 1);
  await pom.expectFieldSize(CYBERPUNK_P2, 1);
  await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, alphaJackieWellesRideOrDieChoom.id);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaArmoredMinotaur.id);

  await pom.expectStructuralState();
});
