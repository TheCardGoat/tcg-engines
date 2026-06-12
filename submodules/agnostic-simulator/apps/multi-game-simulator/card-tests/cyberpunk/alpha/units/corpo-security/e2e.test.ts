import { test } from "@playwright/test";

import { alphaCorpoSecurity, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitCorpoSecurity } from "@cyberpunk/testing/e2e-fixtures";

test("Corpo Security - blocker redirects from opposing side", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitCorpoSecurity);

  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );
  const blocker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  await pom.expectFieldCardGrantedRule(CYBERPUNK_P2, blocker.instanceId, "blocker", true);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P2, blocker.instanceId, "cantAttack", true);
  await pom.expectFieldCardSpent(CYBERPUNK_P2, blocker.instanceId, false);

  await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);

  const blockers = await pom.getMoveCandidateIds(CYBERPUNK_P2, "useBlocker");
  if (!blockers.includes(blocker.instanceId)) {
    throw new Error("Expected Corpo Security to be a visible blocker candidate.");
  }

  await pom.useBlocker(blocker.instanceId, CYBERPUNK_P2);

  const attack = await pom.getAttackState();
  if (!attack) {
    throw new Error("Expected Corpo Security to redirect the direct attack.");
  }
  expectEqual("Corpo Security blocked kind", attack.kind, "fight");
  expectEqual("Corpo Security blocked defender", attack.defenderId, blocker.instanceId);
  expectEqual("Corpo Security blocked redirected", attack.redirectedByBlocker, true);
  await pom.expectFieldCardSpent(CYBERPUNK_P2, blocker.instanceId, true);

  await pom.expectStructuralState();
});
