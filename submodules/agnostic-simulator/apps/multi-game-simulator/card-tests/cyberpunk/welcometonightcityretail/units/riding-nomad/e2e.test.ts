import { test } from "@playwright/test";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitRidingNomadRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Riding Nomad (Retail) - can attack spent units on played turn", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitRidingNomadRetail);

  const nomadInHand = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailRidingNomad.id,
  );
  const spentTarget = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );
  const readyRival = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaArmoredMinotaur.id,
  );

  await pom.playCardFromHand(nomadInHand.instanceId, CYBERPUNK_P1);
  const nomad = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailRidingNomad.id,
  );
  expectEqual("Riding Nomad played this turn", nomad.playedThisTurn, true);

  const attackers = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackUnit");
  const targets = await pom.getMoveTargetCandidateIds(CYBERPUNK_P1, "attackUnit");
  if (!attackers.includes(nomad.instanceId)) {
    throw new Error("Expected Riding Nomad to be an attackUnit candidate after being played.");
  }
  if (!targets.includes(spentTarget.instanceId)) {
    throw new Error("Expected spent Corpo Security to be a Riding Nomad attack target.");
  }
  if (targets.includes(readyRival.instanceId)) {
    throw new Error("Expected ready Armored Minotaur not to be a Riding Nomad attack target.");
  }

  await pom.attackUnit(nomad.instanceId, spentTarget.instanceId, CYBERPUNK_P1);

  const attack = await pom.getAttackState();
  if (!attack) {
    throw new Error("Expected Riding Nomad to start a fight.");
  }
  expectEqual("Riding Nomad attack kind", attack.kind, "fight");
  expectEqual("Riding Nomad attack defender", attack.defenderId, spentTarget.instanceId);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, nomad.instanceId, true);

  await pom.expectStructuralState();
});
