import { test } from "@playwright/test";

import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailGildedMatoN,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitGildedMatonRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Gilded Maton (Retail) - defeats friendly gear to defeat cheap rival unit", async ({
  page,
}) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitGildedMatonRetail);

  const maton = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailGildedMatoN.id,
  );
  const host = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailSwordwiseHuscle.id,
  );
  const gear = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailKiroshiOptics.id,
  );
  const cheapTarget = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );

  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
  await pom.playCardFromHand(maton.instanceId, CYBERPUNK_P1);

  const pending = await pom.getPendingChoiceType(CYBERPUNK_P1);
  if (pending === "chooseCardToMove") {
    const gearChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    expectIncludes("Gilded Maton gear choices", gearChoices, gear.instanceId);
    await pom.resolveCardToMove(gear.instanceId, CYBERPUNK_P1);
  }

  if ((await pom.getPendingChoiceType(CYBERPUNK_P1)) === "chooseTarget") {
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
    expectIncludes(
      "Gilded Maton eligible targets",
      eligibleDefinitions,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expectExcludes(
      "Gilded Maton eligible targets",
      eligibleDefinitions,
      embracingPowerRetailStarterDeckMinotaur.id,
    );
    await pom.resolveEffectTarget([cheapTarget.instanceId], CYBERPUNK_P1);
  }

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 0);
  await pom.expectFieldSize(CYBERPUNK_P1, 2);
  await pom.expectFieldSize(CYBERPUNK_P2, 1);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailKiroshiOptics.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );

  await pom.expectStructuralState();
});
