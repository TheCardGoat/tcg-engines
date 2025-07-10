/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { mrSnoopsBetrayedPartner } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
