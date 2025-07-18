/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  ratiganGreedyGenius,
  theWardrobePerceptiveFriend,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Ratigan - Greedy Genius", () => {
  it("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [ratiganGreedyGenius],
    });

    const cardUnderTest = testEngine.getCardModel(ratiganGreedyGenius);
    expect(cardUnderTest.hasWard).toBe(true);
  });

  describe("TIME RUNS OUT At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.", () => {
    it("Not putting anything into inkwell", async () => {
      const testEngine = new TestEngine({
        play: [ratiganGreedyGenius],
      });

      expect(testEngine.getCardModel(ratiganGreedyGenius).zone).toBe("play");
      await testEngine.passTurn();
      expect(testEngine.getCardModel(ratiganGreedyGenius).zone).toBe("discard");
    });

    it("Not putting anything into inkwell", async () => {
      const testEngine = new TestEngine({
        play: [ratiganGreedyGenius],
        hand: [theWardrobePerceptiveFriend],
      });

      await testEngine.putIntoInkwell(theWardrobePerceptiveFriend);

      expect(testEngine.getCardModel(ratiganGreedyGenius).zone).toBe("play");
      await testEngine.passTurn();
      expect(testEngine.getCardModel(ratiganGreedyGenius).zone).toBe("play");
    });
  });
});
