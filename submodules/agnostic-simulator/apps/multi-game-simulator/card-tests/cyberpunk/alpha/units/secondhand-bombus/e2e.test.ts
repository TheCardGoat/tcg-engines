import { test } from "@playwright/test";

import { alphaArmoredMinotaur, alphaSecondhandBombus } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitSecondhandBombus } from "@cyberpunk/testing/e2e-fixtures";

test("Secondhand Bombus - blocker redirects direct attack", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitSecondhandBombus);

  const bombus = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSecondhandBombus.id,
  );
  const minotaur = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaArmoredMinotaur.id,
  );

  const initialAttack = await pom.getAttackState();
  if (!initialAttack) {
    throw new Error("Expected Secondhand Bombus fixture to start in a direct attack.");
  }
  expectEqual("Bombus attack attacker", initialAttack.attackerId, minotaur.instanceId);
  expectEqual("Bombus initial attack kind", initialAttack.kind, "direct");
  expectEqual("Bombus initial attack step", initialAttack.step, "defensive");
  expectEqual("Bombus initial attack rival", initialAttack.rivalId, CYBERPUNK_P1);

  await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, bombus.instanceId, "blocker", true);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, bombus.instanceId, "cantAttack", true);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, bombus.instanceId, false);

  const blockers = await pom.getMoveCandidateIds(CYBERPUNK_P1, "useBlocker");
  if (!blockers.includes(bombus.instanceId)) {
    throw new Error("Expected Secondhand Bombus to be a visible blocker candidate.");
  }

  await pom.useBlocker(bombus.instanceId, CYBERPUNK_P1);

  const blockedAttack = await pom.getAttackState();
  if (!blockedAttack) {
    throw new Error("Expected Secondhand Bombus to redirect the attack into a fight.");
  }
  expectEqual("Bombus blocked attack kind", blockedAttack.kind, "fight");
  expectEqual("Bombus blocked defender", blockedAttack.defenderId, bombus.instanceId);
  expectEqual("Bombus blocked attack redirected", blockedAttack.redirectedByBlocker, true);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, bombus.instanceId, true);

  await pom.expectStructuralState();
});
