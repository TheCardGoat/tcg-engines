import { test } from "@playwright/test";
import {
  alphaArmoredMinotaur,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailWraithMarauders,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitWraithMaraudersRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Wraith Marauders (Retail) - steals gig and readies matching-power unit", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitWraithMaraudersRetail);

  const wraith = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailWraithMarauders.id,
  );
  const swordwise = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );
  const minotaur = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaArmoredMinotaur.id,
  );

  await pom.attackRival(wraith.instanceId, CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  await pom.resolveAttack(CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
  expectEqual("Wraith Marauders eligible target count", eligible.length, 1);
  expectIncludes("Wraith Marauders eligible targets", eligibleDefinitions, alphaSwordwiseHuscle.id);
  if (eligibleDefinitions.includes(alphaArmoredMinotaur.id)) {
    throw new Error("Expected Armored Minotaur not to be eligible for Wraith Marauders ready.");
  }

  await pom.resolveEffectTarget([swordwise.instanceId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, swordwise.instanceId, false);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, minotaur.instanceId, true);

  await pom.expectStructuralState();
});
