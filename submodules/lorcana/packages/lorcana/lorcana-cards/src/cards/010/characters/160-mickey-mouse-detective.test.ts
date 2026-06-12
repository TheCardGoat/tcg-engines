import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseDetective } from "./160-mickey-mouse-detective";

describe("Mickey Mouse - Detective", () => {
  describe("GET A CLUE - When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("puts the top card of deck into inkwell facedown and exerted when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMouseDetective],
        inkwell: mickeyMouseDetective.cost,
        deck: 5,
      });

      const initialInkwellCount = testEngine.asPlayerOne().getZonesCardCount("player_one").inkwell;
      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(mickeyMouseDetective)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mickeyMouseDetective, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").inkwell).toBe(
        initialInkwellCount + 1,
      );
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(
        initialDeckCount - 1,
      );
    });

    it("does not put a card into inkwell when declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMouseDetective],
        inkwell: mickeyMouseDetective.cost,
        deck: 5,
      });

      const initialInkwellCount = testEngine.asPlayerOne().getZonesCardCount("player_one").inkwell;
      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(mickeyMouseDetective)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mickeyMouseDetective, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").inkwell).toBe(
        initialInkwellCount,
      );
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(initialDeckCount);
    });
  });
});
