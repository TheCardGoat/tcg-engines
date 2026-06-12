import { test } from "@playwright/test";

import {
  spoilerAfterpartyAtLizzieS,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendVStreetkidRetail } from "@cyberpunk/testing/e2e-fixtures";

test("V - Streetkid (Retail) - CALL trashes 3 and recovers Braindance", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, legendVStreetkidRetail);

  const vStreetkid = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    welcomeToNightCityRetailVStreetkid.id,
  );

  const handBefore = await pom.getHandSize(CYBERPUNK_P1);
  const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

  await pom.callLegend(vStreetkid.instanceId, CYBERPUNK_P1);

  // Optional moveCard creates a chooseTarget for the Braindance selection
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("V-Streetkid eligible Braindance count", eligible.length, 1);
  await pom.resolveEffectTarget([eligible[0]!], CYBERPUNK_P1);

  // Optional moveCard then creates chooseCardToMove
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
  const moveChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
  expectEqual("V-Streetkid move choices count", moveChoices.length, 1);
  await pom.resolveCardToMove(moveChoices[0]!, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectEddies(CYBERPUNK_P1, 4); // CALL costs 1 Eddie
  const deckAfter = await pom.getDeckSize(CYBERPUNK_P1);
  expectEqual("V-Streetkid deck after", deckAfter, deckBefore - 3);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore + 1);
  await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, spoilerAfterpartyAtLizzieS.id);

  await pom.expectStructuralState();
});
