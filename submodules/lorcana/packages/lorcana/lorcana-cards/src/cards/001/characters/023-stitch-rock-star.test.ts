import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { stitchRockStar } from "./023-stitch-rock-star";

const cheapCharacter = createMockCharacter({
  id: "cheap-char-1",
  name: "Cheap Character",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const expensiveCharacter = createMockCharacter({
  id: "expensive-char-1",
  name: "Expensive Character",
  cost: 3,
  strength: 2,
  willpower: 2,
});

describe("Stitch - Rock Star", () => {
  describe("ADORING FANS — Whenever you play a character with cost 2 or less, you may exert them to draw a card.", () => {
    it("exerts the played character and draws a card when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cheapCharacter],
          inkwell: cheapCharacter.cost,
          play: [stitchRockStar],
          deck: 3,
        },
        { deck: 2 },
      );

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      // Play cheap character — triggers ADORING FANS
      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");

      // Resolve the triggered ability from the bag (auto-accepts optional)
      expect(testEngine.asPlayerOne().resolvePendingByCard(stitchRockStar)).toBeSuccessfulCommand();

      // The played character should be exerted
      expect(testEngine.isExerted(cheapCharacter)).toBe(true);

      // Should have drawn a card (deck decreased by 1)
      const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;
      expect(deckAfter).toBe(deckBefore - 1);
    });

    it("does not exert or draw when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cheapCharacter],
          inkwell: cheapCharacter.cost,
          play: [stitchRockStar],
          deck: 3,
        },
        { deck: 2 },
      );

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      // Play cheap character
      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();

      // Resolve the bag and decline the optional
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(stitchRockStar, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // The played character should still be ready
      expect(testEngine.isExerted(cheapCharacter)).toBe(false);

      // No card drawn
      const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;
      expect(deckAfter).toBe(deckBefore);
    });

    it("does not trigger when playing a character with cost > 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [expensiveCharacter],
          inkwell: expensiveCharacter.cost,
          play: [stitchRockStar],
          deck: 3,
        },
        { deck: 2 },
      );

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      // Play expensive character — should NOT trigger
      expect(testEngine.asPlayerOne().playCard(expensiveCharacter)).toBeSuccessfulCommand();

      // No bag effects should exist
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Deck unchanged
      const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;
      expect(deckAfter).toBe(deckBefore);
    });
  });
});
