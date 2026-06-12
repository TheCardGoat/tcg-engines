import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrSmeeSteadfastMate } from "./175-mr-smee-steadfast-mate";

const evasiveDefender = createMockCharacter({
  id: "mr-smee-steadfast-mate-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "mr-smee-steadfast-mate-evasive-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Mr. Smee - Steadfast Mate", () => {
  describe("GOOD CATCH — During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrSmeeSteadfastMate],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: mrSmeeSteadfastMate,
        keyword: "Evasive",
      });
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrSmeeSteadfastMate],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: mrSmeeSteadfastMate,
        keyword: "Evasive",
      });
    });

    it("can challenge Evasive characters during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrSmeeSteadfastMate, exerted: false }],
          deck: 1,
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mrSmeeSteadfastMate, evasiveDefender),
      ).toBeSuccessfulCommand();
    });
  });
});
