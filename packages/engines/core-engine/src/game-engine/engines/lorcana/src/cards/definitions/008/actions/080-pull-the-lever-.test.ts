import { describe, expect, it } from "bun:test";
import {
  pullTheLever,
  wrongLeverAction,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pull The Lever!", () => {
  describe("Choose one:", () => {
    it("- Draw 2 cards.", async () => {
      const testEngine = new TestEngine({
        inkwell: pullTheLever.cost,
        hand: [pullTheLever],
        deck: 10,
      });

      await testEngine.playCard(pullTheLever);
      await testEngine.resolveTopOfStack({ mode: "1" });

      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 2,
          deck: 8,
        }),
      );
    });

    it("- Each opponent chooses and discards a card.", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: pullTheLever.cost,
          hand: [pullTheLever],
        },
        {
          hand: [wrongLeverAction],
        },
      );

      await testEngine.playCard(pullTheLever);
      await testEngine.resolveTopOfStack({ mode: "2" });

      expect(testEngine.getCardModel(wrongLeverAction).zone).toEqual("discard");
    });
  });
});
