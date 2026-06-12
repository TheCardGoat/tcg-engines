import { test } from "@playwright/test";

import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaMt0d12Flathead,
  welcomeToNightCityRetailCaliberTotentanzSTopDog,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitCaliberTotentanzSTopDogRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Caliber (Retail) - defeated trigger forces rival discards", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitCaliberTotentanzSTopDogRetail);

  const caliber = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailCaliberTotentanzSTopDog.id,
  );
  const minotaur = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaArmoredMinotaur.id,
  );

  await pom.attackUnit(caliber.instanceId, minotaur.instanceId, CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);

  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailCaliberTotentanzSTopDog.id,
  );
  await pom.expectPendingChoiceType(CYBERPUNK_P2, "chooseTarget");

  const firstChoices = await pom.getEligibleTargetIds(CYBERPUNK_P2);
  const firstDefinitions = await getChoiceDefinitionIds(pom, firstChoices);
  expectIncludes("Caliber first discard choices", firstDefinitions, alphaMt0d12Flathead.id);

  const flatheadId = firstChoices[firstDefinitions.indexOf(alphaMt0d12Flathead.id)];
  if (!flatheadId) {
    throw new Error("Expected Flathead to be discardable for Caliber's first discard.");
  }
  await pom.resolveDiscardFromHand([flatheadId], CYBERPUNK_P2);

  await pom.expectPendingChoiceType(CYBERPUNK_P2, "chooseTarget");
  const bonusChoices = await pom.getEligibleTargetIds(CYBERPUNK_P2);
  const bonusDefinitions = await getChoiceDefinitionIds(pom, bonusChoices);
  expectIncludes("Caliber bonus discard choices", bonusDefinitions, alphaCorpoSecurity.id);

  const corpoId = bonusChoices[bonusDefinitions.indexOf(alphaCorpoSecurity.id)];
  if (!corpoId) {
    throw new Error("Expected Corpo Security to be discardable for Caliber's bonus discard.");
  }
  await pom.resolveDiscardFromHand([corpoId], CYBERPUNK_P2);

  await pom.expectPendingChoiceType(CYBERPUNK_P2, null);
  await pom.expectHandSize(CYBERPUNK_P2, 1);
  await pom.expectTrashSize(CYBERPUNK_P2, 2);
  expectEqual("Caliber attack cleared", await pom.getAttackState(), null);

  await pom.expectStructuralState();
});
