import { describe, expect, it } from "bun:test";
import {
  CANONICAL_PLAYER_ONE,
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { iagoFakeFlamingo } from "./079-iago-fake-flamingo";

const discountedAction = createMockAction({
  id: "iago-discounted-action",
  name: "Discounted Action",
  cost: 3,
  text: "A test action.",
  abilities: [],
});

const nonDiscountedCharacter = createMockCharacter({
  id: "iago-non-discounted-character",
  name: "Full Price Character",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Iago - Fake Flamingo", () => {
  describe("IN DISGUISE", () => {
    it("reduces the cost of the next action you play this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 10,
        play: [{ card: iagoFakeFlamingo, isDrying: false }],
        hand: [discountedAction],
      });

      expect(testEngine.asPlayerOne().quest(iagoFakeFlamingo)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(discountedAction)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(discountedAction)).toBe("discard");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(9);
    });

    it("does not reduce the cost of a character play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 10,
        play: [{ card: iagoFakeFlamingo, isDrying: false }],
        hand: [nonDiscountedCharacter],
      });

      expect(testEngine.asPlayerOne().quest(iagoFakeFlamingo)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(nonDiscountedCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(nonDiscountedCharacter)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(7);
    });
  });
});
