import { waitFor } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Sketchy Ripper (Retail) jsdom happy path", () => {
  test("attack trigger opens deck search with visible optional Gear choices", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitSketchyRipperRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const sketchyRipper = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSketchyRipper.id,
      );

      await pom.attackRival(sketchyRipper.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "scry");
      await waitFor(() => {
        expect(document.body.querySelector('[data-testid="choice-modal-sheet"]')).not.toBeNull();
        expect(document.body.querySelector('[data-testid="target-modal-card"]')).toBeNull();
        expect(document.body.querySelectorAll('[data-testid="search-deck-card"]')).toHaveLength(3);
        expect(document.body.querySelector('[data-testid="search-deck-actions"]')).not.toBeNull();
        expect(document.body.querySelector('[data-testid="search-deck-skip"]')).not.toBeNull();
      });
      const revealed = await pom.getSearchDeckRevealedCardIds(CYBERPUNK_P1);
      expectEqual("Sketchy Ripper reveal count", revealed.length, 3);

      const revealedDefinitions = await Promise.all(
        revealed.map((cardId) => pom.getCardDefinitionId(cardId)),
      );
      const mantisBladesId =
        revealed[revealedDefinitions.indexOf(welcomeToNightCityRetailMantisBlades.id)];
      if (!mantisBladesId) {
        throw new Error("Expected Sketchy Ripper to reveal Mantis Blades as a Gear option.");
      }

      await pom.resolveSearchDeck([mantisBladesId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("attack trigger can take no Gear from the visible deck search", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitSketchyRipperRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const sketchyRipper = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSketchyRipper.id,
      );

      await pom.attackRival(sketchyRipper.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "scry");
      await waitFor(() => {
        expect(document.body.querySelector('[data-testid="choice-modal-sheet"]')).not.toBeNull();
        expect(document.body.querySelector('[data-testid="target-modal-card"]')).toBeNull();
        expect(document.body.querySelectorAll('[data-testid="search-deck-card"]')).toHaveLength(3);
        expect(document.body.querySelector('[data-testid="search-deck-actions"]')).not.toBeNull();
        expect(document.body.querySelector('[data-testid="search-deck-skip"]')).not.toBeNull();
      });

      document.body.querySelector<HTMLButtonElement>('[data-testid="search-deck-skip"]')?.click();

      await waitFor(async () => {
        await expect(pom.getPendingChoiceType(CYBERPUNK_P1)).resolves.toBeNull();
      });
      await pom.expectHandSize(CYBERPUNK_P1, 0);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
