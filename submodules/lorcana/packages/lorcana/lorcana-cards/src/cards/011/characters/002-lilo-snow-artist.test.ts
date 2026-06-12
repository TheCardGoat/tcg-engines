import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { stitchCarefreeSurfer } from "../../001";
import { liloSnowArtist } from "./002-lilo-snow-artist";

describe("Lilo - Snow Artist", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [liloSnowArtist],
      inkwell: liloSnowArtist.cost,
    });

    expect(testEngine.asPlayerOne().playCard(liloSnowArtist)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(liloSnowArtist)).toBe("play");
  });

  describe("CREATIVE INSPIRATION - While you have a character named Stitch in play, this character gets +1 {L}", () => {
    it("should have base lore of 1 when Stitch is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [liloSnowArtist],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(liloSnowArtist)).toBe(1);
    });

    it("should have derived lore of 2 when Stitch is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [liloSnowArtist, stitchCarefreeSurfer],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(liloSnowArtist)).toBe(2);
    });

    it("should gain 1 lore when questing without Stitch in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [liloSnowArtist],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(liloSnowArtist)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
    });

    it("should gain 2 lore when questing with Stitch in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [liloSnowArtist, stitchCarefreeSurfer],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(liloSnowArtist)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
    });
  });
});
