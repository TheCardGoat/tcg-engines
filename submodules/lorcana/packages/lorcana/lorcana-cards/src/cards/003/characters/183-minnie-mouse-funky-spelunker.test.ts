import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { minnieMouseFunkySpelunker } from "./183-minnie-mouse-funky-spelunker";

const forbiddenMountain = createMockLocation({
  id: "minnie-forbidden-mountain",
  name: "Forbidden Mountain",
  cost: 1,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

describe("Minnie Mouse - Funky Spelunker", () => {
  describe("JOURNEY - While this character is at a location, she gets +2 {S}.", () => {
    it("gets +2 strength while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [minnieMouseFunkySpelunker, forbiddenMountain],
        inkwell: forbiddenMountain.moveCost,
      });

      expect(testEngine.asPlayerOne().getCardStrength(minnieMouseFunkySpelunker)).toBe(
        minnieMouseFunkySpelunker.strength,
      );

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(minnieMouseFunkySpelunker, forbiddenMountain),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(minnieMouseFunkySpelunker)).toBe(
        minnieMouseFunkySpelunker.strength + 2,
      );
    });

    it("does NOT get +2 strength when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [minnieMouseFunkySpelunker],
      });

      expect(testEngine.asPlayerOne().getCardStrength(minnieMouseFunkySpelunker)).toBe(
        minnieMouseFunkySpelunker.strength,
      );
    });
  });
});
