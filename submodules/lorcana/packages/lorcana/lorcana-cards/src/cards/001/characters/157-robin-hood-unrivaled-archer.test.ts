import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { robinHoodUnrivaledArcher } from "./157-robin-hood-unrivaled-archer";

const otherCard = createMockCharacter({
  id: "robin-hood-other-card",
  name: "Other Card",
  cost: 1,
});

const deckCard = createMockCharacter({
  id: "robin-hood-deck-card",
  name: "Deck Card",
  cost: 1,
});

describe("Robin Hood - Unrivaled Archer", () => {
  describe("GOOD SHOT - During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodUnrivaledArcher],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: robinHoodUnrivaledArcher,
        keyword: "Evasive",
      });
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodUnrivaledArcher],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: robinHoodUnrivaledArcher,
        keyword: "Evasive",
      });
    });
  });

  describe("FEED THE POOR - When you play this character, if an opponent has more cards in their hand than you, draw a card.", () => {
    it("draws a card when opponent has more cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodUnrivaledArcher],
          inkwell: robinHoodUnrivaledArcher.cost,
          deck: [otherCard],
        },
        {
          hand: [otherCard, otherCard],
        },
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodUnrivaledArcher)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(otherCard)).toBe("hand");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0, play: 1 });
    });

    it("does not draw when opponent does not have more cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodUnrivaledArcher, otherCard],
          inkwell: robinHoodUnrivaledArcher.cost,
          deck: [deckCard],
        },
        {
          hand: [otherCard],
        },
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodUnrivaledArcher)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 1, play: 1 });
    });

    it("does not draw when opponent has equal cards in hand after play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodUnrivaledArcher, otherCard, otherCard],
          inkwell: robinHoodUnrivaledArcher.cost,
          deck: [deckCard],
        },
        {
          hand: [otherCard, otherCard],
        },
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodUnrivaledArcher)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 1, play: 1 });
    });
  });
});
