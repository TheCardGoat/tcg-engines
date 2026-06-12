import { test } from "@playwright/test";

import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  spoilerRoyceDonTCallMeSimon,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitRoyceDonTCallMeSimonHighCred } from "@cyberpunk/testing/e2e-fixtures";

const POWER_THREE_MOCK_ID = "scenario-royce-power-three-mock";

test("Royce - high Street Cred targets power three units", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitRoyceDonTCallMeSimonHighCred);

  const royce = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    spoilerRoyceDonTCallMeSimon.id,
  );

  expectEqual("Royce high P1 Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 10);
  expectEqual("Royce high P2 Street Cred", await pom.getStreetCred(CYBERPUNK_P2), 1);
  await pom.playCardFromHand(royce.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
  expectIncludes("Royce high eligible targets", eligibleDefinitions, alphaCorpoSecurity.id);
  expectIncludes("Royce high eligible targets", eligibleDefinitions, POWER_THREE_MOCK_ID);
  expectExcludes("Royce high eligible targets", eligibleDefinitions, alphaArmoredMinotaur.id);

  const mockId = eligible[eligibleDefinitions.indexOf(POWER_THREE_MOCK_ID)];
  if (!mockId) {
    throw new Error("Expected high-cred Royce to target the power-three mock unit.");
  }
  await pom.resolveEffectTarget([mockId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldSize(CYBERPUNK_P2, 2);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, POWER_THREE_MOCK_ID);

  await pom.expectStructuralState();
});
