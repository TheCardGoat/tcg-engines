/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  outOfOrder,
  yzmaChangedIntoAKitten,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007/";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Yzma - Changed into a Kitten", () => {
  describe("I WON When this character is banished, if you have more cards in hand than any opponent, you may return this character to your hand.", () => {
    it("should NOT return to hand when banished if player does not have more cards in hand", async () => {
      const testEngine = new TestEngine(
        {
          hand: [outOfOrder],
          inkwell: outOfOrder.cost,
        },
        {
          play: [yzmaChangedIntoAKitten],
        },
      );

      await testEngine.playCard(outOfOrder, {
        targets: [yzmaChangedIntoAKitten],
      });

      expect(testEngine.stackLayers).toHaveLength(0);
      expect(testEngine.getCardModel(yzmaChangedIntoAKitten).zone).toBe(
        "discard",
      );
    });

    it("should return to hand when banished if player has more cards in hand", async () => {
      const testEngine = new TestEngine(
        {
          hand: [outOfOrder],
          inkwell: outOfOrder.cost,
        },
        {
          play: [yzmaChangedIntoAKitten],
          hand: 3,
        },
      );

      await testEngine.playCard(
        outOfOrder,
        {
          targets: [yzmaChangedIntoAKitten],
        },
        true,
      );

      testEngine.changeActivePlayer("player_two");
      await testEngine.resolveOptionalAbility();
      expect(testEngine.getCardModel(yzmaChangedIntoAKitten).zone).toBe("hand");
    });
  });
});
