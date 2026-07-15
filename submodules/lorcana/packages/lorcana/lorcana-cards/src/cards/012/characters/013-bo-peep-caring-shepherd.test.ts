import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { boPeepCaringShepherd } from "./013-bo-peep-caring-shepherd";

const woody = createMockCharacter({
  id: "bo-peep-test-woody",
  name: "Woody",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
});

const nonWoodyCharacter = createMockCharacter({
  id: "bo-peep-test-non-woody",
  name: "Some Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Bo Peep - Caring Shepherd", () => {
  describe("SOMEBODY DO SOMETHING! - Your characters named Woody gain Bodyguard.", () => {
    it("grants Bodyguard to your characters named Woody", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [boPeepCaringShepherd, woody],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(woody, "Bodyguard")).toBe(true);
    });

    it("does not grant Bodyguard to characters not named Woody", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [boPeepCaringShepherd, nonWoodyCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(nonWoodyCharacter, "Bodyguard")).toBe(false);
    });

    it("does not grant Bodyguard to Bo Peep herself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [boPeepCaringShepherd],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(boPeepCaringShepherd, "Bodyguard")).toBe(false);
    });

    it("does not grant Bodyguard to opposing Woody characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [boPeepCaringShepherd],
          deck: 2,
        },
        {
          play: [woody],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(woody, "Bodyguard")).toBe(false);
    });
  });
});
