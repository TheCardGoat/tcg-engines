import { describe, expect, it } from "bun:test";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { mrSnoopsBetrayedPartner } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mr. Snoops - Betrayed Partner", () => {
  describe("DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.", () => {
    it("Your turn", async () => {
      const testEngine = new TestEngine({
        inkwell: dragonFire.cost,
        play: [mrSnoopsBetrayedPartner],
        hand: [dragonFire],
        deck: 10,
      });

      await testEngine.playCard(
        dragonFire,
        {
          targets: [mrSnoopsBetrayedPartner],
        },
        true,
      );

      await testEngine.resolveOptionalAbility();

      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({
          deck: 9,
          hand: 1,
        }),
      );
    });

    it("Opponent's turn", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: dragonFire.cost,
          hand: [dragonFire],
        },
        {
          play: [mrSnoopsBetrayedPartner],
          deck: 10,
        },
      );

      await testEngine.playCard(
        dragonFire,
        {
          targets: [mrSnoopsBetrayedPartner],
        },
        true,
      );

      expect(testEngine.stackLayers).toHaveLength(0);
    });
  });
});
