import { describe, test } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  alphaMantisBlades,
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Viktor Vektor - Sit Down and Relax (Retail) jsdom happy path", () => {
  test("calls to search top deck for low-cost gear", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendViktorVektorSitDownAndRelaxRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const viktor = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        theHeistRetailStarterDeckViktorVektorSitDownAndRelax.id,
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
    } finally {
      view.unmount();
    }
  });
});
