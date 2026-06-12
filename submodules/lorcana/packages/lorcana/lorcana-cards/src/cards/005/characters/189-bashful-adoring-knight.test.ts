import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bashfulAdoringKnight } from "./189-bashful-adoring-knight";

const snowWhite = createMockCharacter({
  id: "snow-white-test",
  name: "Snow White",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const otherCharacter = createMockCharacter({
  id: "other-char",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Bashful - Adoring Knight", () => {
  describe("IMPRESS THE PRINCESS - While you have a character named Snow White in play, this character gains Bodyguard", () => {
    it("does not have Bodyguard without Snow White in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [bashfulAdoringKnight],
      });
      expect(testEngine.hasKeyword(bashfulAdoringKnight, "Bodyguard")).toBe(false);
    });

    it("gains Bodyguard when Snow White is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [bashfulAdoringKnight, snowWhite],
      });
      expect(testEngine.hasKeyword(bashfulAdoringKnight, "Bodyguard")).toBe(true);
    });

    it("does not gain Bodyguard from opponent's Snow White", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bashfulAdoringKnight],
          deck: 1,
        },
        {
          play: [snowWhite],
          deck: 1,
        },
      );
      expect(testEngine.hasKeyword(bashfulAdoringKnight, "Bodyguard")).toBe(false);
    });

    it("does not gain Bodyguard from a non-Snow White character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [bashfulAdoringKnight, otherCharacter],
      });
      expect(testEngine.hasKeyword(bashfulAdoringKnight, "Bodyguard")).toBe(false);
    });
  });
});
