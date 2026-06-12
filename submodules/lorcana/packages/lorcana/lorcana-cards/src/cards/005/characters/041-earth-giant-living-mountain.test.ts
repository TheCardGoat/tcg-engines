import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { earthGiantLivingMountain } from "./041-earth-giant-living-mountain";

const opponentDeckCard = createMockCharacter({
  id: "earth-giant-opponent-card",
  name: "Opponent Deck Card",
  cost: 1,
});

describe("Earth Giant - Living Mountain", () => {
  describe("UNEARTHED - When you play this character, each opponent draws a card.", () => {
    it("causes each opponent to draw a card when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [earthGiantLivingMountain],
          inkwell: earthGiantLivingMountain.cost,
        },
        {
          deck: [opponentDeckCard],
        },
      );

      expect(testEngine.asPlayerOne().playCard(earthGiantLivingMountain)).toBeSuccessfulCommand();

      // After playing Earth Giant, opponent should have drawn 1 card
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO)).toEqual(
        expect.objectContaining({ hand: 1, deck: 0 }),
      );
      expect(testEngine.asPlayerTwo().getCardZone(opponentDeckCard)).toBe("hand");
    });

    it("does not draw a card for the controller", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [earthGiantLivingMountain],
          inkwell: earthGiantLivingMountain.cost,
          deck: 3,
        },
        {
          deck: [opponentDeckCard],
        },
      );

      expect(testEngine.asPlayerOne().playCard(earthGiantLivingMountain)).toBeSuccessfulCommand();

      // Controller should not have drawn any cards
      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 0, deck: 3 }),
      );
    });

    it("draws no card for the opponent when their deck is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [earthGiantLivingMountain],
          inkwell: earthGiantLivingMountain.cost,
        },
        {
          deck: 0,
        },
      );

      expect(testEngine.asPlayerOne().playCard(earthGiantLivingMountain)).toBeSuccessfulCommand();

      // Opponent deck is empty, so no card drawn
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO)).toEqual(
        expect.objectContaining({ hand: 0, deck: 0 }),
      );
    });
  });
});
