import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockSong } from "@tcg/lorcana-engine/testing";
import { chiefBogoGazelleFan } from "./011-chief-bogo-gazelle-fan";
import { gazelleAngelWithHorns } from "./088-gazelle-angel-with-horns";

describe("Chief Bogo - Gazelle Fan", () => {
  describe("YOU LIKE GAZELLE TOO?", () => {
    it("does not have Singer while Gazelle is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [chiefBogoGazelleFan],
      });

      expect(testEngine.asPlayerOne().hasKeyword(chiefBogoGazelleFan, "Singer")).toBe(false);
    });

    it("gains Singer 6 while you have a character named Gazelle in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [chiefBogoGazelleFan, gazelleAngelWithHorns],
      });

      expect(testEngine.asPlayerOne().hasKeyword(chiefBogoGazelleFan, "Singer")).toBe(true);
    });

    it("can sing a cost-6 song while Gazelle is in play", () => {
      const expensiveSong = createMockSong({
        id: "chief-bogo-gazelle-fan-song",
        name: "Gazelle Encore",
        cost: 6,
        text: "A cost 6 song.",
        abilities: [],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: chiefBogoGazelleFan, isDrying: false }, gazelleAngelWithHorns],
        hand: [expensiveSong],
        inkwell: 0,
      });

      expect(testEngine.asPlayerOne().hasKeyword(chiefBogoGazelleFan, "Singer")).toBe(true);
      expect(
        testEngine.asPlayerOne().singSong(expensiveSong, chiefBogoGazelleFan),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(expensiveSong)).toBe("discard");
    });
  });
});
