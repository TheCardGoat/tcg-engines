import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pachaTrekmate } from "./102-pacha-trekmate";

const otherCard = createMockCharacter({
  id: "pacha-other-card",
  name: "Other Card",
  cost: 1,
});

describe("Pacha - Trekmate", () => {
  describe("FULL PACK - While you have more cards in your hand than each opponent, this character gets +2 {L}.", () => {
    it("should have +2 lore if having more cards in hand than opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pachaTrekmate],
          hand: [otherCard, otherCard],
          inkwell: pachaTrekmate.cost,
        },
        {
          hand: [otherCard],
        },
      );

      expect(testEngine.asPlayerOne()).toHaveLore({
        card: pachaTrekmate,
        value: 3,
      });
    });

    it("should not have +2 lore if not having more cards in hand than opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pachaTrekmate],
          hand: [otherCard],
          inkwell: pachaTrekmate.cost,
        },
        {
          hand: [otherCard],
        },
      );

      expect(testEngine.asPlayerOne()).toHaveLore({
        card: pachaTrekmate,
        value: 1,
      });
    });

    it("should not have +2 lore if having fewer cards in hand than opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pachaTrekmate],
          hand: [],
          inkwell: pachaTrekmate.cost,
        },
        {
          hand: [otherCard, otherCard],
        },
      );

      expect(testEngine.asPlayerOne()).toHaveLore({
        card: pachaTrekmate,
        value: 1,
      });
    });
  });
});
