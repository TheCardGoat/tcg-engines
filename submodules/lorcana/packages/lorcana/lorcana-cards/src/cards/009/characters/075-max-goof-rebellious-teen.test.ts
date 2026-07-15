import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { trialsAndTribulations } from "../../008";
import { motherKnowsBest } from "../actions/099-mother-knows-best";
import { maxGoofRebelliousTeen } from "./075-max-goof-rebellious-teen";

describe("Max Goof - Rebellious Teen", () => {
  describe("PERSONAL SOUNDTRACK — When you play this character, you may pay 1 ink to return a song card with cost 3 or less from your discard to your hand.", () => {
    it("returns a song with cost 3 or less from discard to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: maxGoofRebelliousTeen.cost + 1,
        hand: [maxGoofRebelliousTeen],
        discard: [trialsAndTribulations],
      });

      expect(testEngine.asPlayerOne().getCardZone(trialsAndTribulations)).toBe("discard");

      expect(testEngine.asPlayerOne().playCard(maxGoofRebelliousTeen)).toBeSuccessfulCommand();

      // Resolve the triggered ability via bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maxGoofRebelliousTeen, {
          targets: [trialsAndTribulations],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(trialsAndTribulations)).toBe("hand");
    });
  });

  describe("Regression", () => {
    it("interaction with Mother Knows Best", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: maxGoofRebelliousTeen.cost + 1,
        hand: [maxGoofRebelliousTeen],
        discard: [motherKnowsBest],
      });

      expect(testEngine.asPlayerOne().getCardZone(motherKnowsBest)).toBe("discard");

      expect(testEngine.asPlayerOne().playCard(maxGoofRebelliousTeen)).toBeSuccessfulCommand();

      // Resolve the triggered ability via bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maxGoofRebelliousTeen, {
          targets: [motherKnowsBest],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(motherKnowsBest)).toBe("hand");
    });
  });
});
