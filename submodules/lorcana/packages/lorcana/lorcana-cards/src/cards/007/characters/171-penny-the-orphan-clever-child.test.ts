import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pennyTheOrphanCleverChild } from "./171-penny-the-orphan-clever-child";

const heroCharacter = createMockCharacter({
  id: "penny-test-hero",
  name: "Hero Character",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const nonHeroCharacter = createMockCharacter({
  id: "penny-test-non-hero",
  name: "Non Hero Character",
  cost: 2,
  classifications: ["Storyborn", "Ally"],
});

describe("Penny the Orphan - Clever Child", () => {
  describe("OUR BOTTLE WORKED! - While you have a Hero character in play, this character gains Ward.", () => {
    it("gains Ward while you have a Hero character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pennyTheOrphanCleverChild, heroCharacter],
      });

      expect(testEngine.hasKeyword(pennyTheOrphanCleverChild, "Ward")).toBe(true);
    });

    it("does NOT have Ward when no Hero character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pennyTheOrphanCleverChild, nonHeroCharacter],
      });

      expect(testEngine.hasKeyword(pennyTheOrphanCleverChild, "Ward")).toBe(false);
    });

    it("does NOT have Ward when Penny is alone in play (she is not a Hero)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pennyTheOrphanCleverChild],
      });

      // Penny herself is an Ally, not a Hero, so no Hero in play
      expect(testEngine.hasKeyword(pennyTheOrphanCleverChild, "Ward")).toBe(false);
    });

    it("gains Ward when a Hero character is played after Penny", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pennyTheOrphanCleverChild],
        hand: [heroCharacter],
        inkwell: heroCharacter.cost,
      });

      expect(testEngine.hasKeyword(pennyTheOrphanCleverChild, "Ward")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(heroCharacter)).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(pennyTheOrphanCleverChild, "Ward")).toBe(true);
    });
  });
});
