import { test } from "@playwright/test";

import { alphaCorpoSecurity, alphaMt0d12Flathead } from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("MT0D12 Flathead - high Street Cred prevents blocking", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/unitMt0d12Flathead?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const flathead = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaMt0d12Flathead.id,
  );
  const blocker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  expectEqual("Flathead Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 8);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, flathead.instanceId, "cantBeBlocked", true);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P2, blocker.instanceId, "blocker", true);

  const directCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackRival");
  if (!directCandidates.includes(flathead.instanceId)) {
    throw new Error("Expected Flathead to be a direct-attack candidate.");
  }

  await pom.attackRival(flathead.instanceId, CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);

  const blockers = await pom.getMoveCandidateIds(CYBERPUNK_P2, "useBlocker");
  if (blockers.includes(blocker.instanceId)) {
    throw new Error("Expected Flathead's cantBeBlocked rule to hide blocker candidates.");
  }

  const attack = await pom.getAttackState();
  if (!attack) {
    throw new Error("Expected Flathead direct attack to remain active.");
  }
  expectEqual("Flathead attack kind", attack.kind, "direct");
  expectEqual("Flathead attack step", attack.step, "defensive");

  await pom.expectStructuralState();
});
