import { test } from "@playwright/test";

import {
  alphaArmoredMinotaur,
  alphaSwordwiseHuscle,
  embracingPowerRetailStarterDeckMinotaur,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { unitEmbracingMinotaur } from "@cyberpunk/testing/e2e-fixtures";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Minotaur (Embracing Power) - higher Street Cred defeats low-power rival Unit", async ({
  page,
}) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitEmbracingMinotaur);
  const minotaur = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    embracingPowerRetailStarterDeckMinotaur.id,
  );

  await pom.playCardFromHand(minotaur.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
  expectIncludes("Minotaur low-power target", eligibleDefinitions, alphaSwordwiseHuscle.id);
  expectExcludes(
    "Minotaur excludes high-power target",
    eligibleDefinitions,
    alphaArmoredMinotaur.id,
  );
  const target = eligible[eligibleDefinitions.indexOf(alphaSwordwiseHuscle.id)];
  if (!target) {
    throw new Error("Expected Minotaur to target Swordwise Huscle.");
  }

  await pom.resolveEffectTarget([target], CYBERPUNK_P1);

  await pom.expectFieldSize(CYBERPUNK_P2, 1);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaSwordwiseHuscle.id);
  await pom.expectStructuralState();
});
