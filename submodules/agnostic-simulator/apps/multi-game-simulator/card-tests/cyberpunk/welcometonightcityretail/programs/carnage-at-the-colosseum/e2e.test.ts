import { test } from "@playwright/test";

import {
  alphaRuthlessLowlife,
  welcomeToNightCityRetailCarnageAtTheColosseum,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progCarnageAtTheColosseumRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Carnage At The Colosseum (Retail) - play defeats weaker rival unit", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progCarnageAtTheColosseumRetail);

  const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);

  const carnage = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailCarnageAtTheColosseum.id,
  );

  await pom.playCardFromHand(carnage.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Carnage eligible targets", eligible.length, 1);
  await pom.resolveEffectTarget([eligible[0]!], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectEddies(CYBERPUNK_P1, eddiesBefore - 4);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaRuthlessLowlife.id);
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailCarnageAtTheColosseum.id,
  );

  await pom.expectStructuralState();
});
