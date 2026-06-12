import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { peterPanNeverLandHero } from "./119-peter-pan-never-land-hero";

const mockTinkerBell = createMockCharacter({
  id: "pp-nlh-tink",
  name: "Tinker Bell",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const mockOther = createMockCharacter({
  id: "pp-nlh-other",
  name: "Captain Hook",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Peter Pan - Never Land Hero", () => {
  describe("Rush", () => {
    it("has Rush keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [peterPanNeverLandHero],
      });

      const cardUnderTest = testEngine.getCardModel(peterPanNeverLandHero);
      expect(cardUnderTest.hasRush).toBe(true);
    });
  });

  describe("OVER HERE, TINK - While you have a character named Tinker Bell in play, this character gets +2 {S}.", () => {
    it("gets +2 strength while Tinker Bell is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peterPanNeverLandHero, mockTinkerBell],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(peterPanNeverLandHero)).toBe(
        peterPanNeverLandHero.strength + 2,
      );
    });

    it("does NOT get +2 strength when Tinker Bell is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peterPanNeverLandHero, mockOther],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(peterPanNeverLandHero)).toBe(
        peterPanNeverLandHero.strength,
      );
    });
  });
});
