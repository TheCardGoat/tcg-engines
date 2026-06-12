import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theCoachmanGreedyDeceiver } from "./140-the-coachman-greedy-deceiver";

const helperCharA = createMockCharacter({
  id: "coachman-helper-a",
  name: "Helper A",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const helperCharB = createMockCharacter({
  id: "coachman-helper-b",
  name: "Helper B",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("The Coachman - Greedy Deceiver", () => {
  describe("WILD RIDE — While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive.", () => {
    it("does not gain +2 strength or Evasive with only 1 exerted character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theCoachmanGreedyDeceiver, helperCharA, helperCharB],
        deck: 5,
      });

      // Exert only one character
      expect(testEngine.asServer().manualExertCard(helperCharA)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(theCoachmanGreedyDeceiver)).toBe(
        theCoachmanGreedyDeceiver.strength,
      );
      expect(testEngine.asPlayerOne().hasKeyword(theCoachmanGreedyDeceiver, "Evasive")).toBe(false);
    });

    it("gains +2 strength and Evasive when 2 or more characters are exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theCoachmanGreedyDeceiver, helperCharA, helperCharB],
        deck: 5,
      });

      // Exert two characters
      expect(testEngine.asServer().manualExertCard(helperCharA)).toBeSuccessfulCommand();
      expect(testEngine.asServer().manualExertCard(helperCharB)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(theCoachmanGreedyDeceiver)).toBe(
        theCoachmanGreedyDeceiver.strength + 2,
      );
      expect(testEngine.asPlayerOne().hasKeyword(theCoachmanGreedyDeceiver, "Evasive")).toBe(true);
    });
  });
});
