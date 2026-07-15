import { test } from "@playwright/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailSaulBrightStormrider,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { retailPr2295Cards } from "@cyberpunk/testing/e2e-fixtures";

test("Overwatch - Panam's Gift (Retail) - attached to Saul discards to defeat a spent rival Unit", async ({
  page,
}) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, retailPr2295Cards);

  const overwatch = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailOverwatchPanamSGift.id,
  );
  const corpo = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );
  const saul = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailSaulBrightStormrider.id,
  );

  await pom.activateAbility(overwatch.instanceId, 1, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const discardChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  await pom.resolveEffectTarget([discardChoices[0]!], CYBERPUNK_P1);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, saul.instanceId, true);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const defeatChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual(
    "Overwatch can target spent Corpo Security",
    defeatChoices.includes(corpo.instanceId),
    true,
  );
  await pom.resolveEffectTarget([corpo.instanceId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.expectStructuralState();
});
