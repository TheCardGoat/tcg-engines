import { test } from "@playwright/test";

import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaKiroshiOptics,
  alphaSwordwiseHuscle,
  spoilerGildedMaton,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitGildedMaton } from "@cyberpunk/testing/e2e-fixtures";

test("Gilded Maton - defeats friendly gear to defeat cheap rival unit", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitGildedMaton);

  const maton = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, spoilerGildedMaton.id);
  const host = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );
  const gear = await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, alphaKiroshiOptics.id);
  const cheapTarget = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
  await pom.playCardFromHand(maton.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
  const gearChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
  expectEqual("Gilded Maton gear choice count", gearChoices.length, 1);
  expectEqual("Gilded Maton gear choice", gearChoices[0], gear.instanceId);

  await pom.resolveCardToMove(gear.instanceId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
  expectIncludes("Gilded Maton eligible targets", eligibleDefinitions, alphaCorpoSecurity.id);
  expectExcludes("Gilded Maton eligible targets", eligibleDefinitions, alphaArmoredMinotaur.id);

  await pom.resolveEffectTarget([cheapTarget.instanceId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 0);
  await pom.expectFieldSize(CYBERPUNK_P1, 2);
  await pom.expectFieldSize(CYBERPUNK_P2, 1);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, alphaKiroshiOptics.id);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);

  await pom.expectStructuralState();
});
