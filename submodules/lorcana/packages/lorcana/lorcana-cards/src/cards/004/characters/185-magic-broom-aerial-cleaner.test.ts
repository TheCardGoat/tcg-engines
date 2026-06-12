import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { magicBroomAerialCleaner } from "./185-magic-broom-aerial-cleaner";

const evasiveDefender = createMockCharacter({
  id: "magic-broom-aerial-cleaner-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "magic-broom-aerial-cleaner-evasive-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Magic Broom - Aerial Cleaner", () => {
  describe("WINGED FOR A DAY — During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicBroomAerialCleaner],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: magicBroomAerialCleaner,
        keyword: "Evasive",
      });
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicBroomAerialCleaner],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: magicBroomAerialCleaner,
        keyword: "Evasive",
      });
    });

    it("can challenge Evasive characters during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: magicBroomAerialCleaner, exerted: false }],
          deck: 1,
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(magicBroomAerialCleaner, evasiveDefender),
      ).toBeSuccessfulCommand();
    });
  });
});
