/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  pullTheLever,
  wrongLeverAction,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Pull The Lever!", () => {
  describe("Choose one:", () => {
    it("- Draw 2 cards.", async () => {
      const testEngine = new TestEngine({
        inkwell: pullTheLever.cost,
        hand: [pullTheLever],
        deck: 10,
      });

      await testEngine.playCard(pullTheLever, { mode: "1" });

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

      await testEngine.playCard(pullTheLever, { mode: "2" }, true);

      testEngine.changeActivePlayer("player_two");
      await testEngine.resolveTopOfStack({
        targets: [wrongLeverAction],
      });

      expect(testEngine.getCardModel(wrongLeverAction).zone).toEqual("discard");
    });
  });
});
