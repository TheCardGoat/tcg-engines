import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE } from "@tcg/shared/testing";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { princeEricSeafaringPrince } from "./021-prince-eric-seafaring-prince";
import { maxLoyalSheepdog } from "./014-max-loyal-sheepdog";

describe("Max - Loyal Sheepdog", () => {
  describe("HERE BOY — If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.", () => {
    it("costs full cost when no Prince Eric is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [maxLoyalSheepdog],
        inkwell: maxLoyalSheepdog.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(maxLoyalSheepdog)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(maxLoyalSheepdog)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 1 less when a Prince Eric character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [maxLoyalSheepdog],
        play: [princeEricSeafaringPrince],
        inkwell: maxLoyalSheepdog.cost - 1,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(maxLoyalSheepdog)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(maxLoyalSheepdog)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("cannot be played for full cost when only cost - 1 ink is available and no Prince Eric in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [maxLoyalSheepdog],
        inkwell: maxLoyalSheepdog.cost - 1,
        deck: 2,
      });

      const result = testEngine.asPlayerOne().playCard(maxLoyalSheepdog);
      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(maxLoyalSheepdog)).toBe("hand");
    });
  });
});
