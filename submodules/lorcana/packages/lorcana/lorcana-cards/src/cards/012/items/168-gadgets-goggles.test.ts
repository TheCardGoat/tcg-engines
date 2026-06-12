import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { gadgetsGoggles } from "./168-gadgets-goggles";

// Deck arrays are in bottom-to-top order: the LAST element is the top card.
const deepDeckCard = createMockCharacter({
  id: "gadgets-goggles-deep",
  name: "Deep Deck Card",
  cost: 3,
});

const secondFromTopCard = createMockCharacter({
  id: "gadgets-goggles-second",
  name: "Second From Top Card",
  cost: 2,
});

const topDeckCard = createMockCharacter({
  id: "gadgets-goggles-top",
  name: "Top Deck Card",
  cost: 1,
});

describe("Gadget's Goggles", () => {
  describe("ENHANCED VISION - {E}, 1 {I} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
    it("puts the chosen card on top of the deck and the other on the bottom", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        play: [gadgetsGoggles],
        deck: [deepDeckCard, secondFromTopCard, topDeckCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(gadgetsGoggles, {
          ability: "ENHANCED VISION",
        }),
      ).toBeSuccessfulCommand();

      // Scry looks at topDeckCard and secondFromTopCard.
      // Keep secondFromTopCard on top; send topDeckCard to the bottom.
      expect(
        testEngine.asPlayerOne().resolvePendingEffect(gadgetsGoggles, {
          destinations: [
            { zone: "deck-top", cards: [secondFromTopCard] },
            { zone: "deck-bottom", cards: [topDeckCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // Deck (bottom-to-top): topDeckCard, deepDeckCard, secondFromTopCard
      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        topDeckCard.id,
        deepDeckCard.id,
        secondFromTopCard.id,
      ]);
    });

    it("can keep the original top card on top of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        play: [gadgetsGoggles],
        deck: [deepDeckCard, secondFromTopCard, topDeckCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(gadgetsGoggles, {
          ability: "ENHANCED VISION",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(gadgetsGoggles, {
          destinations: [
            { zone: "deck-top", cards: [topDeckCard] },
            { zone: "deck-bottom", cards: [secondFromTopCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // Deck (bottom-to-top): secondFromTopCard, deepDeckCard, topDeckCard
      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        secondFromTopCard.id,
        deepDeckCard.id,
        topDeckCard.id,
      ]);
    });
  });
});
