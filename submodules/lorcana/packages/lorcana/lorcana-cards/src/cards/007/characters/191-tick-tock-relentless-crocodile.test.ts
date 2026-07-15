import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { ticktockRelentlessCrocodile } from "./191-tick-tock-relentless-crocodile";

const pirateCharacter = createMockCharacter({
  id: "tick-tock-pirate",
  name: "Pirate Character",
  cost: 2,
  classifications: ["Storyborn", "Pirate"],
});

const nonPirateCharacter = createMockCharacter({
  id: "tick-tock-non-pirate",
  name: "Non-Pirate Character",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Tick-Tock - Relentless Crocodile", () => {
  describe("LOOKING FOR LUNCH", () => {
    it("gains Evasive during your turn while a Pirate character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ticktockRelentlessCrocodile, pirateCharacter],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: ticktockRelentlessCrocodile,
        keyword: "Evasive",
      });
    });

    it("does not have Evasive during your turn when no Pirate character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ticktockRelentlessCrocodile, nonPirateCharacter],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: ticktockRelentlessCrocodile,
        keyword: "Evasive",
      });
    });

    it("does not have Evasive during opponent's turn even with a Pirate in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ticktockRelentlessCrocodile, pirateCharacter],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: ticktockRelentlessCrocodile,
        keyword: "Evasive",
      });
    });

    it("gains Evasive during your turn when opponent has a Pirate character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ticktockRelentlessCrocodile],
          deck: 1,
        },
        {
          play: [pirateCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: ticktockRelentlessCrocodile,
        keyword: "Evasive",
      });
    });
  });
});
