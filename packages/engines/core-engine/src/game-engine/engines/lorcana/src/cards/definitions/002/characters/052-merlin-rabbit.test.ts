/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  goofyKnightForADay,
  merlinRabbit,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin - Rabbit", () => {
  describe("**HOPPITY HIP!** When you play this character and when he leaves play, you may draw a card.", () => {
    it("When you play", () => {
      const testStore = new TestStore({
        inkwell: merlinRabbit.cost,
        hand: [merlinRabbit],
        deck: 1,
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", merlinRabbit.id);

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          deck: 1,
          hand: 1,
          play: 0,
        }),
      );

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          deck: 0,
          hand: 1,
          play: 1,
        }),
      );
    });

    it("When he leaves play", () => {
      const testStore = new TestStore(
        {
          play: [merlinRabbit],
          deck: 1,
        },
        { play: [goofyKnightForADay] },
      );

      const defender = testStore.getByZoneAndId(
        "play",
        goofyKnightForADay.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId("play", merlinRabbit.id);

      defender.updateCardMeta({ exerted: true });

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          deck: 1,
          hand: 0,
          play: 1,
          discard: 0,
        }),
      );

      attacker.challenge(defender);
      testStore.resolveOptionalAbility();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          deck: 0,
          hand: 1,
          play: 0,
          discard: 1,
        }),
      );
    });
  });
});
