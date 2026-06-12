import { test } from "@playwright/test";

import { alphaCorpoSecurity, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { gearMantisBlades } from "@cyberpunk/testing/e2e-fixtures";

test("Mantis Blades - host power boost", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, gearMantisBlades);

  const host = await pom.getCard(alphaSwordwiseHuscle, { zone: "field" });
  const defender = await pom.getCard(alphaCorpoSecurity, { zone: "field", player: CYBERPUNK_P2 });

  await pom.expectFieldSize(CYBERPUNK_P1, 1);
  await pom.expectFieldCardAttachedGearCount(alphaSwordwiseHuscle, 1);
  await pom.expectFieldCardEffectivePower(alphaSwordwiseHuscle, 7);

  await pom.attackUnit(host, defender);
  const attack = await pom.getAttackState();
  if (!attack) {
    throw new Error("Expected Mantis Blades host to start a fight.");
  }
  expectEqual("Mantis Blades attack kind", attack.kind, "fight");
  expectEqual("Mantis Blades attack defender", attack.defenderId, defender.instanceId);
  await pom.expectFieldCardEffectivePower(alphaSwordwiseHuscle, 7);

  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);

  expectEqual("Mantis Blades attack cleared", await pom.getAttackState(), null);
  await pom.expectFieldSize(CYBERPUNK_P1, 1);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.getCard(alphaCorpoSecurity, { zone: "trash", player: CYBERPUNK_P2 });

  await pom.expectStructuralState();
});
