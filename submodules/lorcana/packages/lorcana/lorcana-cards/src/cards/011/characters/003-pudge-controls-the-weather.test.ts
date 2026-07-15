import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pudgeControlsTheWeather } from "./003-pudge-controls-the-weather";
import { liloSnowArtist } from "./002-lilo-snow-artist";

const nonLiloCharacter = createMockCharacter({
  id: "pudge-test-non-lilo",
  name: "Not Lilo",
  cost: 1,
});

describe("Pudge - Controls the Weather", () => {
  describe("GOOD FRIEND - If you have a character named Lilo in play, you can play this character for free.", () => {
    it("can be played for free when Lilo is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pudgeControlsTheWeather],
        play: [liloSnowArtist],
        inkwell: 0,
      });

      expect(testEngine.asPlayerOne().playCard(pudgeControlsTheWeather)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(pudgeControlsTheWeather)).toBe("play");
    });

    it("cannot be played without enough ink when Lilo is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pudgeControlsTheWeather],
        inkwell: 1,
      });

      expect(testEngine.asPlayerOne().playCard(pudgeControlsTheWeather).success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(pudgeControlsTheWeather)).toBe("hand");
    });

    it("can be played at full cost when Lilo is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pudgeControlsTheWeather],
        inkwell: pudgeControlsTheWeather.cost,
      });

      expect(testEngine.asPlayerOne().playCard(pudgeControlsTheWeather)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(pudgeControlsTheWeather)).toBe("play");
    });

    it("discount does not apply when only a non-Lilo character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pudgeControlsTheWeather],
        play: [nonLiloCharacter],
        inkwell: 1,
      });

      expect(testEngine.asPlayerOne().playCard(pudgeControlsTheWeather).success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(pudgeControlsTheWeather)).toBe("hand");
    });
  });
});
