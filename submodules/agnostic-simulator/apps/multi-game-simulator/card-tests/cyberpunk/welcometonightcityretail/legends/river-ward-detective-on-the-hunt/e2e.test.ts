import { test } from "@playwright/test";

import {
  alphaKiroshiOptics,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendRiverWardDetectiveOnTheHuntRetail } from "@cyberpunk/testing/e2e-fixtures";

test("River Ward (Retail) - spend plays gear from hand for free", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendRiverWardDetectiveOnTheHuntRetail,
  );

  const river = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    welcomeToNightCityRetailRiverWardDetectiveOnTheHunt.id,
  );

  const handBefore = await pom.getHandSize(CYBERPUNK_P1);
  expectEqual("River Ward hand before", handBefore, 1);

  await pom.activateAbility(river.instanceId, 1, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("River Ward eligible gear count", eligible.length, 1);
  await pom.resolveEffectTarget([eligible[0]!], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");
  const playChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
  expectEqual("River Ward play choices count", playChoices.length, 1);
  await pom.resolveCardToPlay(playChoices[0]!, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectLegendCardSpent(CYBERPUNK_P1, river.instanceId, true);
  await pom.expectEddies(CYBERPUNK_P1, 5);
  await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, alphaKiroshiOptics.id);
  const handAfter = await pom.getHandSize(CYBERPUNK_P1);
  expectEqual("River Ward hand after", handAfter, 0);

  await pom.expectStructuralState();
});
