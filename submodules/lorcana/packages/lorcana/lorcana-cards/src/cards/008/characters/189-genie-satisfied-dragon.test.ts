import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { genieSatisfiedDragon } from "./189-genie-satisfied-dragon";

describe("Genie - Satisfied Dragon", () => {
  describe("BUG CATCHER - During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [genieSatisfiedDragon],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.hasKeyword(genieSatisfiedDragon, "Evasive")).toBe(true);
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [genieSatisfiedDragon],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(genieSatisfiedDragon, "Evasive")).toBe(false);
    });

    it("regains Evasive when it becomes your turn again", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [genieSatisfiedDragon],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.hasKeyword(genieSatisfiedDragon, "Evasive")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(genieSatisfiedDragon, "Evasive")).toBe(false);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(genieSatisfiedDragon, "Evasive")).toBe(true);
    });
  });
});
