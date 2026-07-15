import { waitFor } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailFoolOnTheHill,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailPeaceOffering,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Fool on the Hill jsdom happy path", () => {
  test("renders a rival destination prompt and resolves the trash-draw branch", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailProgramTargetBench" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const fool = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailFoolOnTheHill.id,
      );

      await pom.playCardFromHand(fool.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P2, "revealDestination");
      await pom.takeControl(CYBERPUNK_P2);
      await waitFor(() => {
        const options = document.body.querySelectorAll('[data-testid="reveal-destination-option"]');
        expect(options).toHaveLength(2);
      });
      const deckReveal = view.container.querySelector<HTMLElement>(
        '[data-testid="deck-zone"][data-side="player"] [data-testid="deck-reveal-shelf"]',
      );
      expect(deckReveal).not.toBeNull();
      expect(deckReveal?.getAttribute("data-reveal-count")).toBe("2");
      expect(deckReveal?.getAttribute("data-reveal-visibility")).toBe("public");
      const revealedCards = Array.from(
        document.body.querySelectorAll('[data-testid="deck-reveal-card"]'),
      );
      expect(revealedCards.some((card) => card.getAttribute("title") === "Sketchy Ripper")).toBe(
        true,
      );
      expect(
        revealedCards.some((card) => card.getAttribute("title") === "Industrial Assembly"),
      ).toBe(true);
      expect(
        Array.from(document.body.querySelectorAll('[data-testid="reveal-destination-option"]')).map(
          (option) => option.getAttribute("data-destination"),
        ),
      ).toEqual(["hand", "trash"]);

      await pom.resolveRevealDestination("trash", CYBERPUNK_P2);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await waitFor(() => {
        expect(
          view.container.querySelector(
            '[data-testid="deck-zone"][data-side="player"] [data-testid="deck-reveal-shelf"]',
          ),
        ).toBeNull();
      });
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailFoolOnTheHill.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSketchyRipper.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailIndustrialAssembly.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPeaceOffering.id,
      );
      await pom.expectHandSize(CYBERPUNK_P1, 9);
      expectEqual(
        "Fool on the Hill deck after reveal choice",
        await pom.getDeckSize(CYBERPUNK_P1),
        22,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
