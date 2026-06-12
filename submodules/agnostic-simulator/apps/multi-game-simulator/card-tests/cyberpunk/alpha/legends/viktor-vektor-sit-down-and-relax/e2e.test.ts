import { test } from "@playwright/test";

import {
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaViktorVektorSitDownAndRelax,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendViktorVektorSitDownAndRelax } from "@cyberpunk/testing/e2e-fixtures";

test("Viktor Vektor - call searches top deck for gear", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, legendViktorVektorSitDownAndRelax);

  const viktor = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    alphaViktorVektorSitDownAndRelax.id,
  );

  await pom.callLegend(viktor.instanceId, CYBERPUNK_P1);

  const calledViktor = await pom.getCardInZoneByInstanceId(
    "legendArea",
    CYBERPUNK_P1,
    viktor.instanceId,
  );
  expectEqual("Viktor is face-up", calledViktor.faceDown, false);
  await pom.expectEddies(CYBERPUNK_P1, 2);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "searchDeck");

  const revealed = await pom.getSearchDeckRevealedCardIds(CYBERPUNK_P1);
  expectEqual("Viktor reveal count", revealed.length, 5);
  const revealedDefinitions = await Promise.all(
    revealed.map((cardId) => pom.getCardDefinitionId(cardId)),
  );
  const selected = [
    revealed[revealedDefinitions.indexOf(alphaKiroshiOptics.id)]!,
    revealed[revealedDefinitions.indexOf(alphaMantisBlades.id)]!,
  ];
  if (selected.some((cardId) => !cardId)) {
    throw new Error("Expected Viktor search to reveal Kiroshi Optics and Mantis Blades.");
  }

  await pom.resolveSearchDeck(selected, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectHandSize(CYBERPUNK_P1, 3);
  expectEqual("Viktor deck after selecting two gear", await pom.getDeckSize(CYBERPUNK_P1), 37);

  await pom.expectStructuralState();
});
