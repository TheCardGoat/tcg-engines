import { test } from "@playwright/test";

import {
  spoilerRiverWardDetectiveOnTheHunt,
  welcomeToNightCityRetailChromeReverie,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progChromeReverieRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Chrome Reverie (Retail) - play grants cantAttack then calls legend for free", async ({
  page,
}) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progChromeReverieRetail);

  const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);

  const chrome = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailChromeReverie.id,
  );

  const legendBefore = await pom.getCardsInZone("legendArea", CYBERPUNK_P1);
  const faceDownLegend = legendBefore.find(
    (c) => c.definitionId === spoilerRiverWardDetectiveOnTheHunt.id,
  );
  expectEqual("Face-down legend exists", faceDownLegend !== undefined, true);

  await pom.playCardFromHand(chrome.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible1 = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Chrome Reverie first eligible count", eligible1.length, 2);
  await pom.resolveEffectTarget([eligible1[0]!], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible2 = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Chrome Reverie second eligible count", eligible2.length, 1);
  await pom.resolveEffectTarget([eligible2[0]!], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectEddies(CYBERPUNK_P1, eddiesBefore - 3);
  await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailChromeReverie.id,
  );

  await pom.expectStructuralState();
});
