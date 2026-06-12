import { test } from "@playwright/test";

import { alphaArmoredMinotaur, alphaSecondhandBombus } from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../poms/CyberpunkPlaywrightHarnessClient";

test("Defensive - block decision", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/defensiveStep?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  expectEqual("defensiveStep phase", await pom.getPhase(), "main");
  expectEqual("defensiveStep active player", await pom.getActivePlayerId(), CYBERPUNK_P2);
  await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
  await pom.expectBoardMode(CYBERPUNK_P2, "view");
  await pom.expectGigCount(CYBERPUNK_P1, 0);
  await pom.expectGigCount(CYBERPUNK_P2, 1);

  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaArmoredMinotaur.id,
  );
  const blocker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSecondhandBombus.id,
  );
  const initialAttack = await pom.getAttackState();
  if (!initialAttack) {
    throw new Error("Expected defensiveStep to start in an attack.");
  }
  expectEqual("initial attack kind", initialAttack.kind, "direct");
  expectEqual("initial attack step", initialAttack.step, "defensive");
  expectEqual("initial attacker", initialAttack.attackerId, attacker.instanceId);
  expectEqual("initial defender", initialAttack.defenderId, null);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, blocker.instanceId, false);

  await pom.useBlocker(blocker.instanceId, CYBERPUNK_P1);

  const blockedAttack = await pom.getAttackState();
  if (!blockedAttack) {
    throw new Error("Expected attack state after using a blocker.");
  }
  expectEqual("blocked attack kind", blockedAttack.kind, "fight");
  expectEqual("blocked attack step", blockedAttack.step, "defensive");
  expectEqual("blocked attack defender", blockedAttack.defenderId, blocker.instanceId);
  expectEqual("blocked attack redirected", blockedAttack.redirectedByBlocker, true);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, blocker.instanceId, true);
  await pom.expectGigCount(CYBERPUNK_P1, 0);
  await pom.expectGigCount(CYBERPUNK_P2, 1);

  await pom.expectStructuralState();
});
