import { test } from "@playwright/test";

import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaSecondhandBombus,
} from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getChoiceDefinitionIds,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Armored Minotaur - high Street Cred defeats low-power rival", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/unitArmoredMinotaur?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const minotaur = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    alphaArmoredMinotaur.id,
  );
  const corpo = await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P2, alphaCorpoSecurity.id);

  expectEqual("Minotaur Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 14);
  await pom.playCardFromHand(minotaur.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
  expectEqual("Minotaur eligible count", eligible.length, 2);
  expectIncludes("Minotaur eligible definitions", eligibleDefinitions, alphaCorpoSecurity.id);
  expectIncludes("Minotaur eligible definitions", eligibleDefinitions, alphaSecondhandBombus.id);

  await pom.resolveEffectTarget([corpo.instanceId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldSize(CYBERPUNK_P1, 2);
  await pom.expectFieldSize(CYBERPUNK_P2, 1);
  await pom.expectTrashSize(CYBERPUNK_P2, 1);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);

  await pom.expectStructuralState();
});
