import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseEnthusiasticDancer } from "./112-mickey-mouse-enthusiastic-dancer";

const mockMinnie = createMockCharacter({
  id: "mm-ed-minnie",
  name: "Minnie Mouse",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const mockOther = createMockCharacter({
  id: "mm-ed-other",
  name: "Donald Duck",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Mickey Mouse - Enthusiastic Dancer", () => {
  describe("PERFECT PARTNERS - While you have a character named Minnie Mouse in play, this character gets +2 {S}.", () => {
    it("gets +2 strength while Minnie Mouse is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseEnthusiasticDancer, mockMinnie],
      });

      expect(testEngine.asPlayerOne().getCardStrength(mickeyMouseEnthusiasticDancer)).toBe(
        mickeyMouseEnthusiasticDancer.strength + 2,
      );
    });

    it("does NOT get +2 strength when Minnie Mouse is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseEnthusiasticDancer, mockOther],
      });

      expect(testEngine.asPlayerOne().getCardStrength(mickeyMouseEnthusiasticDancer)).toBe(
        mickeyMouseEnthusiasticDancer.strength,
      );
    });
  });
});
