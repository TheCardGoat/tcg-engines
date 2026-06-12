import { test } from "@playwright/test";

import { alphaArmoredMinotaur, alphaCorpoSecurity } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendYorinobuArasakaEmbracingDestructionRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Yorinobu (Retail) - first Arasaka attack draw/discard", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    legendYorinobuArasakaEmbracingDestructionRetail,
  );

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
