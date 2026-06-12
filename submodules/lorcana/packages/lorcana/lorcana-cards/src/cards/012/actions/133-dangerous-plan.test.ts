import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dangerousPlan } from "./133-dangerous-plan";

const handFiller1 = createMockCharacter({
  id: "dangerous-plan-hand-1",
  name: "Hand Filler One",
  cost: 2,
});

const handFiller2 = createMockCharacter({
  id: "dangerous-plan-hand-2",
  name: "Hand Filler Two",
  cost: 2,
});

const deckTop1 = createMockCharacter({
  id: "dangerous-plan-deck-top-1",
  name: "Deck Top One",
  cost: 3,
});

const deckTop2 = createMockCharacter({
  id: "dangerous-plan-deck-top-2",
  name: "Deck Top Two",
  cost: 3,
});

describe("Dangerous Plan", () => {
  it("draws 2 cards then discards a card at random from the controller's hand", () => {
    const originalRandom = Math.random;
    Math.random = () => 0;

    try {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [dangerousPlan, handFiller1, handFiller2],
        deck: [deckTop1, deckTop2],
        inkwell: dangerousPlan.cost,
      });

      expect(testEngine.asPlayerOne().playCard(dangerousPlan)).toBeSuccessfulCommand();

      // Both top cards were drawn from the deck
      expect(testEngine.asPlayerOne().getCardZone(deckTop1)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(deckTop2)).toBe("hand");

      // The played action is in discard
      expect(testEngine.asPlayerOne().getCardZone(dangerousPlan)).toBe("discard");

      // Exactly one of the hand cards (excluding the action that went to discard)
      // was randomly discarded.
      const handCards = [handFiller1, handFiller2, deckTop1, deckTop2];
      const discardedHandCount = handCards.filter(
        (card) => testEngine.asPlayerOne().getCardZone(card) === "discard",
      ).length;
      expect(discardedHandCount).toBe(1);

      // No pending effects remain after resolution
      expect(testEngine.asPlayerOne()).toHavePendingEffectCount(0);
    } finally {
      Math.random = originalRandom;
    }
  });
});
