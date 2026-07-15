import { test } from "@playwright/test";

import { welcomeToNightCityRetailPeaceOffering } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progPeaceOfferingRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Peace Offering (Retail) - play copies gig value and draws", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progPeaceOfferingRetail);

  const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);
  const handBefore = await pom.getHandSize(CYBERPUNK_P1);

  const peace = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailPeaceOffering.id,
  );

  await pom.playCardFromHand(peace.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Peace Offering eligible gig count", eligible.length, 2);
  await pom.resolveEffectTarget([eligible[0]!, eligible[1]!], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectEddies(CYBERPUNK_P1, eddiesBefore - 1);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore);
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailPeaceOffering.id,
  );

  await pom.expectStructuralState();
});
