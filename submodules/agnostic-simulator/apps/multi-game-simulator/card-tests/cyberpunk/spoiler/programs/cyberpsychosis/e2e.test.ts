import { test } from "@playwright/test";

import {
  alphaSecondhandBombus,
  alphaTBugAmateurPhilosopher,
  spoilerCyberpsychosis,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progCyberpsychosis } from "@cyberpunk/testing/e2e-fixtures";

test("Cyberpsychosis - equipped unit attack window", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progCyberpsychosis);

  const tBug = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaTBugAmateurPhilosopher.id,
  );
  const bombus = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSecondhandBombus.id,
  );

  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectEddies(CYBERPUNK_P1, 3);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, tBug.instanceId, 2);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, tBug.instanceId, 8);

  await pom.attackRival(tBug.instanceId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTrigger");

  const triggerOptions = await pom.getPendingTriggerOptions(CYBERPUNK_P1);
  const cyberpsychosisTrigger = expectDefined(
    "Cyberpsychosis trigger option",
    triggerOptions.find((option) => option.cardName === spoilerCyberpsychosis.displayName),
  );
  expectEqual("Cyberpsychosis trigger optional flag", cyberpsychosisTrigger.optional, true);

  await pom.resolveTrigger(cyberpsychosisTrigger.triggerId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

  const equippedUnitTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Cyberpsychosis equipped unit target count", equippedUnitTargets.length, 1);
  if (!equippedUnitTargets.includes(tBug.instanceId)) {
    throw new Error("Expected equipped T-Bug to be the Cyberpsychosis target.");
  }

  await pom.resolveEffectTarget([tBug.instanceId], CYBERPUNK_P1);
  const additionalCostTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Cyberpsychosis additional-cost target count", additionalCostTargets.length, 2);
  if (additionalCostTargets.includes(tBug.instanceId)) {
    throw new Error("Expected attacking T-Bug to be excluded from additional-cost targets.");
  }
  if (!additionalCostTargets.includes(bombus.instanceId)) {
    throw new Error("Expected ready Secondhand Bombus to be an additional-cost target.");
  }

  await pom.resolveEffectTarget([bombus.instanceId], CYBERPUNK_P1);

  await pom.expectHandSize(CYBERPUNK_P1, 0);
  await pom.expectEddies(CYBERPUNK_P1, 1);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, tBug.instanceId, true);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, bombus.instanceId, true);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, tBug.instanceId, 12);

  const remainingTriggers = await pom.getPendingTriggerOptions(CYBERPUNK_P1);
  if (remainingTriggers.some((option) => option.cardName === spoilerCyberpsychosis.displayName)) {
    throw new Error("Expected Cyberpsychosis to leave the trigger queue after resolving.");
  }

  await pom.expectStructuralState();
});
