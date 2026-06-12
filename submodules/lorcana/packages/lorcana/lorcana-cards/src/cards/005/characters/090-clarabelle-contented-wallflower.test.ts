import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { clarabelleContentedWallflower } from "./090-clarabelle-contented-wallflower";

const drawnCard = createMockCharacter({
  id: "clarabelle-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Clarabelle - Contented Wallflower", () => {
  describe("ONE STEP BEHIND - When you play this character, if an opponent has more cards in their hand than you, you may draw a card.", () => {
    it("draws a card when opponent has more cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleContentedWallflower],
          inkwell: clarabelleContentedWallflower.cost,
          deck: [drawnCard],
        },
        {
          hand: 5,
        },
      );

      // Player one has 1 card in hand (Clarabelle), opponent has 5
      expect(
        testEngine.asPlayerOne().playCard(clarabelleContentedWallflower),
      ).toBeSuccessfulCommand();

      // Should have a triggered ability in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the optional ability (accept it)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(clarabelleContentedWallflower),
      ).toBeSuccessfulCommand();

      // Should have drawn a card
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleContentedWallflower],
          inkwell: clarabelleContentedWallflower.cost,
          deck: [drawnCard],
        },
        {
          hand: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(clarabelleContentedWallflower),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(clarabelleContentedWallflower, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Should NOT have drawn a card
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });

    it("does not trigger when opponent has fewer cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleContentedWallflower],
          inkwell: clarabelleContentedWallflower.cost,
          deck: [drawnCard],
        },
        {
          hand: 0,
        },
      );

      // Player one has 1 card, opponent has 0 - condition not met
      expect(
        testEngine.asPlayerOne().playCard(clarabelleContentedWallflower),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });

    it("does not trigger when opponent has the same number of cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleContentedWallflower],
          inkwell: clarabelleContentedWallflower.cost,
          deck: [drawnCard],
        },
        {
          hand: 0,
        },
      );

      // After playing Clarabelle, player has 0 cards in hand, opponent has 0 - equal, no trigger
      expect(
        testEngine.asPlayerOne().playCard(clarabelleContentedWallflower),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });
  });
});
