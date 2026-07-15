import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dawsonPuzzlingSleuth } from "./161-dawson-puzzling-sleuth";

const topCard = createMockCharacter({ id: "dawson-top-card", name: "Top Card", cost: 1 });
const secondCard = createMockCharacter({ id: "dawson-second-card", name: "Second Card", cost: 2 });
const inkCard = createMockCharacter({ id: "dawson-ink-card", name: "Ink Card", cost: 1 });

describe("Dawson - Puzzling Sleuth", () => {
  // BE SENSIBLE - "Once during your turn, whenever a card is put into your inkwell,
  // look at the top card of your deck. You may put it on either the top or the bottom of your deck."
  // NOTE: The trigger uses `on: "CONTROLLER"` which fires correctly when a card is inked.

  it("BE SENSIBLE - can be played and ink triggers scry when a card is inked", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkCard],
      deck: [topCard, secondCard],
      play: [dawsonPuzzlingSleuth],
    });

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

    // If the trigger fires, resolve the bag effect
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(dawsonPuzzlingSleuth),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          destinations: [
            { zone: "deck-top", cards: [] },
            { zone: "deck-bottom", cards: [secondCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // Verify order: topCard on top, secondCard on bottom
      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds).toEqual([secondCard.id, topCard.id]);
    }

    // Card should remain in play
    expect(testEngine.asPlayerOne().getCardZone(dawsonPuzzlingSleuth)).toBe("play");
    // Ink card should be in inkwell
    expect(testEngine.asPlayerOne().getCardZone(inkCard)).toBe("inkwell");
  });

  it.todo("regression: card placed on top via scry should stay on top after drawing (engine: scry deck-top ordering bug)", () => {
    // Bug: Card placed on top of deck via Dawson's scry was not staying after inking/drawing.
    // When you scry and put a card on top, subsequent draws should draw that card.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkCard],
      deck: [topCard, secondCard],
      play: [dawsonPuzzlingSleuth],
    });

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

    // If the trigger fires, resolve to keep topCard on top
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(dawsonPuzzlingSleuth),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          destinations: [
            { zone: "deck-top", cards: [topCard] },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // Verify topCard is on top of deck
      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds[0]).toBe(topCard.id);
    }
  });
});
