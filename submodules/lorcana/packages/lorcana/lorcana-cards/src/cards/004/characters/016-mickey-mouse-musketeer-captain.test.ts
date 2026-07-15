import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseMusketeerCaptain } from "./016-mickey-mouse-musketeer-captain";

describe("Mickey Mouse - Musketeer Captain", () => {
  it("has Shift, Bodyguard, and Support keywords", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mickeyMouseMusketeerCaptain],
    });

    expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseMusketeerCaptain, "Shift")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseMusketeerCaptain, "Bodyguard")).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseMusketeerCaptain, "Support")).toBe(true);
  });

  describe("MUSKETEERS UNITED - When you play this character, if you used Shift to play him, you may draw a card for each character with Bodyguard you have in play.", () => {
    it("does NOT trigger when played normally (without Shift)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseMusketeerCaptain],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
