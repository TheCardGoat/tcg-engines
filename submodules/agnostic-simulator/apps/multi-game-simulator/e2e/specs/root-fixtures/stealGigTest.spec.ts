import { test } from "@playwright/test";

import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../poms/CyberpunkPlaywrightHarnessClient";

test("Validate Steal Gig", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/stealGigTest?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  expectEqual("stealGigTest phase", await pom.getPhase(), "main");
  expectEqual("stealGigTest active player", await pom.getActivePlayerId(), CYBERPUNK_P1);
  await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
  await pom.expectBoardMode(CYBERPUNK_P2, "view");
  await pom.expectGigCount(CYBERPUNK_P1, 4);
  await pom.expectGigCount(CYBERPUNK_P2, 3);

  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );
  const stolenGig = (await pom.getGigDice(CYBERPUNK_P2))[0];
  if (!stolenGig) {
    throw new Error("Expected P2 to have a gig to steal.");
  }

  await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
  let attack = await pom.getAttackState();
  if (!attack) {
    throw new Error("Expected direct attack state after attackRival.");
  }
  expectEqual("direct attack kind", attack.kind, "direct");
  expectEqual("direct attack step", attack.step, "offensive");
  await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, true);

  await pom.resolveAttack(CYBERPUNK_P1);
  attack = await pom.getAttackState();
  expectEqual("direct attack defensive step", attack?.step, "defensive");

  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  attack = await pom.getAttackState();
  expectEqual("direct attack steal step", attack?.step, "steal");

  await pom.resolveAttack(CYBERPUNK_P1, { gigIdsToSteal: [stolenGig.id] });
  expectEqual("attack cleared after steal", await pom.getAttackState(), null);
  await pom.expectGigCount(CYBERPUNK_P1, 5);
  await pom.expectGigCount(CYBERPUNK_P2, 2);

  await pom.expectStructuralState();
});
