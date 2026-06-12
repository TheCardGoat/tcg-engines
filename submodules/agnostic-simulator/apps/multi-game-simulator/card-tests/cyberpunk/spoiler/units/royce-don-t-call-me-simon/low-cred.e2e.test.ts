import { test } from "@playwright/test";

import {
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
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
import { unitRoyceDonTCallMeSimonLowCred } from "@cyberpunk/testing/e2e-fixtures";

test("Royce - low Street Cred targets power two or less", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitRoyceDonTCallMeSimonLowCred);

  const royce = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    spoilerRoyceDonTCallMeSimon.id,
  );
  const lowlife = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaRuthlessLowlife.id,
  );

  expectEqual("Royce low P1 Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 2);
  expectEqual("Royce low P2 Street Cred", await pom.getStreetCred(CYBERPUNK_P2), 6);
  await pom.playCardFromHand(royce.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
  expectEqual("Royce low eligible count", eligible.length, 1);
  expectIncludes("Royce low eligible targets", eligibleDefinitions, alphaRuthlessLowlife.id);
  expectExcludes("Royce low eligible targets", eligibleDefinitions, alphaSwordwiseHuscle.id);

  await pom.resolveEffectTarget([lowlife.instanceId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldSize(CYBERPUNK_P2, 1);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaRuthlessLowlife.id);

  await pom.expectStructuralState();
});
