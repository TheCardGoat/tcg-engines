import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { princeJohnOpportunisticBriber } from "./141-prince-john-opportunistic-briber";

const testItem = createMockItem({
  id: "prince-john-test-item",
  name: "Test Item",
  cost: 2,
});

const secondTestItem = createMockItem({
  id: "prince-john-test-item-2",
  name: "Test Item 2",
  cost: 2,
});

describe("Prince John - Opportunistic Briber", () => {
  describe("TAXES NEVER FAIL ME - Whenever you play an item, this character gets +2 {S} this turn.", () => {
    it("gains +2 strength when you play an item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: princeJohnOpportunisticBriber }],
        hand: [testItem],
        inkwell: testItem.cost,
        deck: 1,
      });

      const strengthBefore = testEngine
        .asPlayerOne()
        .getCardStrength(princeJohnOpportunisticBriber);
      expect(strengthBefore).toBe(princeJohnOpportunisticBriber.strength);

      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(princeJohnOpportunisticBriber)).toBe(
        princeJohnOpportunisticBriber.strength + 2,
      );
    });

    it("stacks +2 strength for each item played in the same turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: princeJohnOpportunisticBriber }],
        hand: [testItem, secondTestItem],
        inkwell: testItem.cost + secondTestItem.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(princeJohnOpportunisticBriber)).toBe(
        princeJohnOpportunisticBriber.strength + 2,
      );

      expect(testEngine.asPlayerOne().playCard(secondTestItem)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(princeJohnOpportunisticBriber)).toBe(
        princeJohnOpportunisticBriber.strength + 4,
      );
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: princeJohnOpportunisticBriber }],
        hand: [testItem],
        inkwell: testItem.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(princeJohnOpportunisticBriber)).toBe(
        princeJohnOpportunisticBriber.strength + 2,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(princeJohnOpportunisticBriber)).toBe(
        princeJohnOpportunisticBriber.strength,
      );
    });

    it("does not trigger when the opponent plays an item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: princeJohnOpportunisticBriber }],
          deck: 1,
        },
        {
          hand: [testItem],
          inkwell: testItem.cost,
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(testItem)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(princeJohnOpportunisticBriber)).toBe(
        princeJohnOpportunisticBriber.strength,
      );
    });
  });
});
