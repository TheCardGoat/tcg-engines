import { test } from "@playwright/test";

import { alphaArmoredMinotaur, alphaCorpoSecurity } from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Yorinobu - first Arasaka attack draw/discard", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/legendYorinobuArasakaEmbracingDestruction?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const minotaur = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaArmoredMinotaur.id,
  );
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );

  await pom.expectHandSize(CYBERPUNK_P1, 2);
  expectEqual("Yorinobu starting deck", await pom.getDeckSize(CYBERPUNK_P1), 37);

  await pom.attackUnit(minotaur.instanceId, defender.instanceId, CYBERPUNK_P1);

  await pom.expectHandSize(CYBERPUNK_P1, 3);
  expectEqual("Yorinobu deck after draw", await pom.getDeckSize(CYBERPUNK_P1), 36);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

  const discardChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Yorinobu discard choices", discardChoices.length, 3);
  await pom.resolveDiscardFromHand([discardChoices[0]!], CYBERPUNK_P1);

  await pom.expectHandSize(CYBERPUNK_P1, 2);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);

  await pom.expectStructuralState();
});
