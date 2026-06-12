import { test } from "@playwright/test";

import {
  alphaCorporateSurveillance,
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendAltCunninghamSoulkillerArchitectRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Alt Cunningham (Retail) - spends to play a Program from trash", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendAltCunninghamSoulkillerArchitectRetail,
  );

  const alt = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    welcomeToNightCityRetailAltCunninghamSoulkillerArchitect.id,
  );

  await pom.activateAbility(alt.instanceId, 1, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Alt Cunningham eligible trash program count", eligible.length, 1);

  await pom.resolveEffectTarget([eligible[0]!], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");
  const playChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
  expectEqual("Alt Cunningham play choices count", playChoices.length, 1);
  await pom.resolveCardToPlay(playChoices[0]!, CYBERPUNK_P1);

  // Corporate Surveillance PLAY trigger: spend a rival unit with cost 3 or less
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const spendEligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Corporate Surveillance eligible spend targets", spendEligible.length, 1);
  await pom.resolveEffectTarget([spendEligible[0]!], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectEddies(CYBERPUNK_P1, 6); // 8 - 2 (Corporate Surveillance cost)
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, alphaCorporateSurveillance.id);
  await pom.expectStructuralState();
});
