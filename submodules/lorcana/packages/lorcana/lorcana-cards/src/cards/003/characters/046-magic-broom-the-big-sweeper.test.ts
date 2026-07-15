import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { magicBroomTheBigSweeper } from "./046-magic-broom-the-big-sweeper";

const forbiddenMountain = createMockLocation({
  id: "magic-broom-forbidden-mountain",
  name: "Forbidden Mountain",
  cost: 1,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

describe("Magic Broom - The Big Sweeper", () => {
  describe("CLEAN SWEEP - While this character is at a location, it gets +2 {S}.", () => {
    it("gets +2 strength while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicBroomTheBigSweeper, forbiddenMountain],
        inkwell: forbiddenMountain.moveCost,
      });

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomTheBigSweeper)).toBe(
        magicBroomTheBigSweeper.strength,
      );

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(magicBroomTheBigSweeper, forbiddenMountain),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomTheBigSweeper)).toBe(
        magicBroomTheBigSweeper.strength + 2,
      );
    });

    it("does NOT get +2 strength when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicBroomTheBigSweeper],
      });

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomTheBigSweeper)).toBe(
        magicBroomTheBigSweeper.strength,
      );
    });
  });
});
