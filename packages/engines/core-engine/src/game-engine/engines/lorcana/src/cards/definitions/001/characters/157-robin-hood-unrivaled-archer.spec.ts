/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  ransack,
  youHaveForgottenMe,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  magicBroomBucketBrigade,
  robinHoodUnrivaledArcher,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Robin Hood - Unrivaled Archer", () => {
  describe("Good Shot: During your turn, this character gains **Evasive**.", () => {
    it("During your turn.", () => {
      const testStore = new TestStore(
        {
          play: [robinHoodUnrivaledArcher],
        },
        {
          play: [robinHoodUnrivaledArcher],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        robinHoodUnrivaledArcher.id,
      );

      expect(cardUnderTest.hasEvasive).toBeTruthy();
    });

    it("During opponent's turn.", () => {
      const testStore = new TestStore(
        {},
        {
          play: [robinHoodUnrivaledArcher],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        robinHoodUnrivaledArcher.id,
        "player_two",
      );

      expect(cardUnderTest.hasEvasive).toBeFalsy();
    });
  });

  describe("Feed the Poor - When you play this character, if an opponent has more cards in their hand than you, draw a card.", () => {
    it("Player has less cards than opponent", () => {
      const testStore = new TestStore(
        {
          deck: 1,
          inkwell: robinHoodUnrivaledArcher.cost,
          hand: [robinHoodUnrivaledArcher, ransack],
        },
        {
          hand: [magicBroomBucketBrigade, youHaveForgottenMe],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        robinHoodUnrivaledArcher.id,
      );

      cardUnderTest.playFromHand();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 1 + 1, deck: 0, play: 1 }),
      );
    });

    it("Player has more cards than opponent", () => {
      const testStore = new TestStore({
        deck: 1,
        inkwell: robinHoodUnrivaledArcher.cost,
        hand: [robinHoodUnrivaledArcher, ransack],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        robinHoodUnrivaledArcher.id,
      );

      cardUnderTest.playFromHand();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 1, deck: 1, play: 1 }),
      );
    });
  });
});
