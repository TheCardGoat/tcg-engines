import { test } from "@playwright/test";

import {
  spoilerAfterpartyAtLizzieS,
  spoilerEvelynParkerBeautifulEnigma,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Evelyn Parker - spend searches for Braindance", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/legendEvelynParkerBeautifulEnigma?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

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
