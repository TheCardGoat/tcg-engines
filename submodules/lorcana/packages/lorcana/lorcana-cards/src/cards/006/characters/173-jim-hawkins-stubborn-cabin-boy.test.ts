import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jimHawkinsStubbornCabinBoy } from "./173-jim-hawkins-stubborn-cabin-boy";

const inkCard = createMockCharacter({
  id: "jim-ink-card",
  name: "Ink Fodder",
  cost: 1,
  inkable: true,
});

describe("Jim Hawkins - Stubborn Cabin Boy", () => {
  describe("COME HERE, COME HERE, COME HERE! - During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn.", () => {
    it("gains Challenger +2 when a card is inked this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jimHawkinsStubbornCabinBoy],
        hand: [inkCard],
      });

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      // The effect targets SELF (no player input needed), so it auto-resolves without going to the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().hasKeyword(jimHawkinsStubbornCabinBoy, "Challenger")).toBe(
        true,
      );
      expect(testEngine.getKeywordValue(jimHawkinsStubbornCabinBoy, "Challenger")).toBe(2);
    });

    it("Challenger +2 effect expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jimHawkinsStubbornCabinBoy],
          hand: [inkCard],
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(jimHawkinsStubbornCabinBoy, "Challenger")).toBe(
        true,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(jimHawkinsStubbornCabinBoy, "Challenger")).toBe(
        false,
      );
    });

    it("does not trigger during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jimHawkinsStubbornCabinBoy],
          deck: 1,
        },
        {
          hand: [inkCard],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().ink(inkCard)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().hasKeyword(jimHawkinsStubbornCabinBoy, "Challenger")).toBe(
        false,
      );
    });
  });
});
