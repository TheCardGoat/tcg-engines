import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heartOfTeFiti } from "./164-heart-of-te-fiti";

describe("Heart of Te Fiti", () => {
  describe("CREATE LIFE — {E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("puts the top card of your deck into your inkwell facedown and exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [heartOfTeFiti],
        inkwell: 2,
        deck: 3,
      });

      const beforeInkwellCount = testEngine.asPlayerOne().getZonesCardCount().inkwell;
      const beforeDeckCount = testEngine.asPlayerOne().getZonesCardCount().deck;

      const result = testEngine.asPlayerOne().activateAbility(heartOfTeFiti, {
        ability: "CREATE LIFE",
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(heartOfTeFiti)).toBe(true);
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(beforeInkwellCount + 1);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(beforeDeckCount - 1);
    });

    it("requires 2 ink to activate", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [heartOfTeFiti],
        inkwell: 1,
        deck: 1,
      });

      const result = testEngine.asPlayerOne().activateAbility(heartOfTeFiti, {
        ability: "CREATE LIFE",
      });

      expect(result).not.toBeSuccessfulCommand();
    });

    it("does nothing when deck is empty (no cards to move)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [heartOfTeFiti],
        inkwell: 2,
        deck: 0,
      });

      const beforeInkwellCount = testEngine.asPlayerOne().getZonesCardCount().inkwell;

      const result = testEngine.asPlayerOne().activateAbility(heartOfTeFiti, {
        ability: "CREATE LIFE",
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(beforeInkwellCount);
    });
  });
});
