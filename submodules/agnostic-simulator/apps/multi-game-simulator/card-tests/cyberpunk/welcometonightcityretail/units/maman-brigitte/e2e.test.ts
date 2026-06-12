import { test } from "@playwright/test";

import {
  alphaCorporateSurveillance,
  alphaKiroshiOptics,
  alphaRebootOptics,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
  getZoneDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitMamanBrigitteRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Maman Brigitte (Retail) - discards programs to bottom-deck unequipped unit", async ({
  page,
}) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitMamanBrigitteRetail);

  const maman = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailMamanBrigitteSpiritOfDeath.id,
  );
  const reboot = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaRebootOptics.id);
  const surveillance = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    alphaCorporateSurveillance.id,
  );
  await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaKiroshiOptics.id);
  const unequippedTarget = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaRuthlessLowlife.id,
  );

  const deckBefore = await pom.getDeckSize(CYBERPUNK_P2);
  await pom.playCardFromHand(maman.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const discardChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  const discardDefinitions = await getChoiceDefinitionIds(pom, discardChoices);
  expectEqual("Maman discard choice count", discardChoices.length, 2);
  expectIncludes("Maman discard definitions", discardDefinitions, alphaRebootOptics.id);
  expectIncludes("Maman discard definitions", discardDefinitions, alphaCorporateSurveillance.id);
  expectExcludes("Maman discard definitions", discardDefinitions, alphaKiroshiOptics.id);

  await pom.resolveDiscardFromHand([reboot.instanceId, surveillance.instanceId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const targetChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  const targetDefinitions = await getChoiceDefinitionIds(pom, targetChoices);
  expectEqual("Maman bottom-deck target count", targetChoices.length, 1);
  expectIncludes("Maman target definitions", targetDefinitions, alphaRuthlessLowlife.id);
  expectExcludes("Maman target definitions", targetDefinitions, alphaSwordwiseHuscle.id);

  await pom.resolveEffectTarget([unequippedTarget.instanceId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldSize(CYBERPUNK_P2, 1);
  await pom.expectTrashSize(CYBERPUNK_P1, 2);
  expectEqual("Maman rival deck size", await pom.getDeckSize(CYBERPUNK_P2), deckBefore + 1);

  const p2Deck = await getZoneDefinitionIds(pom, "deck", CYBERPUNK_P2);
  expectEqual("Maman bottom-decked card", p2Deck[p2Deck.length - 1], alphaRuthlessLowlife.id);

  await pom.expectStructuralState();
});
