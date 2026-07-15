import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { slightlyLostBoy } from "./124-slightly-lost-boy";
import { peterPanNeverLandHero } from "./119-peter-pan-never-land-hero";

describe("Slightly - Lost Boy", () => {
  describe("THE FOX - If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.", () => {
    it("can be played with 1 less ink when Peter Pan is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: slightlyLostBoy.cost - 1,
        play: [peterPanNeverLandHero],
        hand: [slightlyLostBoy],
      });

      expect(testEngine.asPlayerOne().playCard(slightlyLostBoy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(slightlyLostBoy)).toBe("play");
    });

    it("cannot be played with 1 less ink when Peter Pan is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: slightlyLostBoy.cost - 1,
        hand: [slightlyLostBoy],
      });

      const result = testEngine.asPlayerOne().playCard(slightlyLostBoy);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(slightlyLostBoy)).toBe("hand");
    });
  });

  describe("Evasive", () => {
    it("has the Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [slightlyLostBoy],
      });

      expect(testEngine.hasKeyword(slightlyLostBoy, "Evasive")).toBe(true);
    });
  });
});
