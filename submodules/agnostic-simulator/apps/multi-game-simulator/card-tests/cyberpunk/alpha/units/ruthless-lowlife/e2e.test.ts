import { test } from "@playwright/test";

import { alphaArmoredMinotaur, alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitRuthlessLowlife } from "@cyberpunk/testing/e2e-fixtures";

test("Ruthless Lowlife - spent unit changes stolen gig to 1", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitRuthlessLowlife);

  expectEqual("Ruthless initial choice", await pom.getPendingChoiceType(CYBERPUNK_P1), "gainGig");
  await pom.gainGig(await pom.pickFirstAllowedDie(CYBERPUNK_P1), CYBERPUNK_P1);

  const lowlife = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaRuthlessLowlife.id,
  );
  const p2GigToSteal = (await pom.getGigDice(CYBERPUNK_P2))[0];
  if (!p2GigToSteal) {
    throw new Error("Expected a rival gig for Ruthless Lowlife to steal first.");
  }

  await pom.attackRival(lowlife.instanceId, CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  await pom.resolveAttack(CYBERPUNK_P1, { gigIdsToSteal: [p2GigToSteal.id] });
  await pom.expectFieldCardSpent(CYBERPUNK_P1, lowlife.instanceId, true);

  await pom.passPhase(CYBERPUNK_P1);
  expectEqual("Ruthless P2 choice", await pom.getPendingChoiceType(CYBERPUNK_P2), "gainGig");
  await pom.gainGig(await pom.pickFirstAllowedDie(CYBERPUNK_P2), CYBERPUNK_P2);

  const minotaur = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaArmoredMinotaur.id,
  );
  const p1GigToSteal = (await pom.getGigDice(CYBERPUNK_P1))[0];
  if (!p1GigToSteal) {
    throw new Error("Expected a friendly gig for P2 to steal.");
  }

  await pom.attackRival(minotaur.instanceId, CYBERPUNK_P2);
  await pom.resolveAttack(CYBERPUNK_P2);
  await pom.resolveAttack(CYBERPUNK_P1, { pass: true });
  await pom.resolveAttack(CYBERPUNK_P2, { gigIdsToSteal: [p1GigToSteal.id] });

  await pom.expectGigValue(p1GigToSteal.id, 1);
  const p2Gigs = await pom.getGigDice(CYBERPUNK_P2);
  if (!p2Gigs.some((die) => die.id === p1GigToSteal.id)) {
    throw new Error("Expected the stolen gig to move to P2's gig area.");
  }
  await pom.expectFieldCardSpent(CYBERPUNK_P1, lowlife.instanceId, true);

  await pom.expectStructuralState();
});
