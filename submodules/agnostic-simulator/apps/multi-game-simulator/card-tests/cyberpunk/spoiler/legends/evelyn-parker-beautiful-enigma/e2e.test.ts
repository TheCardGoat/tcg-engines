import { test } from "@playwright/test";

import {
  spoilerAfterpartyAtLizzieS,
  spoilerEvelynParkerBeautifulEnigma,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendEvelynParkerBeautifulEnigma } from "@cyberpunk/testing/e2e-fixtures";

test("Evelyn Parker - spend searches for Braindance", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, legendEvelynParkerBeautifulEnigma);

  const evelyn = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    spoilerEvelynParkerBeautifulEnigma.id,
  );

  await pom.activateAbility(evelyn.instanceId, 1, CYBERPUNK_P1);

  await pom.expectLegendCardSpent(CYBERPUNK_P1, evelyn.instanceId, true);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "searchDeck");
  const revealed = await pom.getSearchDeckRevealedCardIds(CYBERPUNK_P1);
  expectEqual("Evelyn reveal count", revealed.length, 3);

  const definitions = await Promise.all(revealed.map((cardId) => pom.getCardDefinitionId(cardId)));
  const afterpartyId = revealed[definitions.indexOf(spoilerAfterpartyAtLizzieS.id)];
  if (!afterpartyId) {
    throw new Error("Expected Evelyn search to reveal Afterparty at Lizzie's.");
  }

  await pom.resolveSearchDeck([afterpartyId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectHandSize(CYBERPUNK_P1, 2);
  expectEqual("Evelyn deck after search", await pom.getDeckSize(CYBERPUNK_P1), 38);
  await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, spoilerAfterpartyAtLizzieS.id);

  await pom.expectStructuralState();
});
