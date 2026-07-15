import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { zipperFlyingRanger } from "./192-zipper-flying-ranger";
import { montereyJackDefiantProtector } from "./188-monterey-jack-defiant-protector";

describe("Zipper - Flying Ranger", () => {
  describe("BEST MATES - If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.", () => {
    it("can be played for 1 less ink when Monterey Jack is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [zipperFlyingRanger],
        play: [montereyJackDefiantProtector],
        inkwell: zipperFlyingRanger.cost - 1,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(zipperFlyingRanger)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(zipperFlyingRanger)).toBe("play");
    });

    it("cannot be played for less ink when Monterey Jack is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [zipperFlyingRanger],
        inkwell: zipperFlyingRanger.cost - 1,
        deck: 2,
      });

      const result = testEngine.asPlayerOne().playCard(zipperFlyingRanger);
      expect(result.success).toBe(false);
    });
  });

  describe("BURST OF SPEED - During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [zipperFlyingRanger],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.hasKeyword(zipperFlyingRanger, "Evasive")).toBe(true);
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [zipperFlyingRanger],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(zipperFlyingRanger, "Evasive")).toBe(false);
    });
  });
});
