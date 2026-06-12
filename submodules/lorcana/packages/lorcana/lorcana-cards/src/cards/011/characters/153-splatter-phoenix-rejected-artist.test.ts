import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { splatterPhoenixRejectedArtist } from "./153-splatter-phoenix-rejected-artist";

describe("Splatter Phoenix - Rejected Artist", () => {
  it("has Ward keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [splatterPhoenixRejectedArtist],
    });

    const cardUnderTest = testEngine.getCardModel(splatterPhoenixRejectedArtist);
    expect(cardUnderTest.hasWard()).toBe(true);
  });

  describe("UNDERDOG", () => {
    it("costs 1 less on the first turn when not the first player", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 5 },
        {
          hand: [splatterPhoenixRejectedArtist],
          inkwell: splatterPhoenixRejectedArtist.cost - 1,
          deck: 5,
        },
      );

      testEngine.asPlayerOne().passTurn();

      const result = testEngine.asPlayerTwo().playCard(splatterPhoenixRejectedArtist);
      expect(result.success).toBe(true);
      expect(testEngine.asPlayerTwo().getCardZone(splatterPhoenixRejectedArtist)).toBe("play");
    });

    it("does NOT reduce cost for the first player", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [splatterPhoenixRejectedArtist],
          inkwell: splatterPhoenixRejectedArtist.cost - 1,
          deck: 5,
        },
        { deck: 5 },
      );

      const result = testEngine.asPlayerOne().playCard(splatterPhoenixRejectedArtist);
      expect(result.success).toBe(false);
    });
  });
});
