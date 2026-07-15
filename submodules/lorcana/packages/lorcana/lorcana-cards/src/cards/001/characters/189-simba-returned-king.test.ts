import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaReturnedKing } from "./189-simba-returned-king";

describe("Simba - Returned King", () => {
  describe("Challenger +4", () => {
    it("has Challenger +4", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [simbaReturnedKing],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(simbaReturnedKing, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(simbaReturnedKing, "Challenger")).toBe(4);
    });
  });

  describe("POUNCE — During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [simbaReturnedKing],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: simbaReturnedKing,
        keyword: "Evasive",
      });
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [simbaReturnedKing],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: simbaReturnedKing,
        keyword: "Evasive",
      });
    });
  });
});
