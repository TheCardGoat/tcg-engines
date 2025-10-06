/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { youHaveForgottenMe } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  liloMakingAWish,
  moanaOfMotunui,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { suddenChill } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { princeJohnGreediestOfAll } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince John - Greediest of All", () => {
  it("Ward", () => {
    const testStore = new TestStore({
      play: [princeJohnGreediestOfAll],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      princeJohnGreediestOfAll.id,
    );

    expect(cardUnderTest.hasWard).toEqual(true);
  });

  describe("**I SENTENCE YOU** Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.", () => {
    it("Doesn't trigger when you discard a card", () => {
      const testStore = new TestStore(
        {
          hand: [youHaveForgottenMe],
          inkwell: youHaveForgottenMe.cost,
          deck: 3,
        },
        {
          play: [princeJohnGreediestOfAll],
          hand: [moanaOfMotunui, liloMakingAWish, stichtNewDog],
          deck: 3,
        },
      );

      const handDisruption = testStore.getByZoneAndId(
        "hand",
        youHaveForgottenMe.id,
      );
      const target = testStore.getByZoneAndId(
        "hand",
        liloMakingAWish.id,
        "player_two",
      );
      const target2 = testStore.getByZoneAndId(
        "hand",
        stichtNewDog.id,
        "player_two",
      );

      handDisruption.playFromHand();

      testStore.changePlayer("player_two");
      testStore.resolveTopOfStack({ targets: [target, target2] }, true);
      expect(target.zone).toEqual("discard");
      expect(target2.zone).toEqual("discard");

      expect(testStore.stackLayers).toHaveLength(0);
      expect(testStore.getZonesCardCount("player_one").deck).toEqual(3);
      expect(testStore.getZonesCardCount("player_two").deck).toEqual(3);
    });

    it("Opponent discarding one card", () => {
      const testStore = new TestStore(
        {
          play: [princeJohnGreediestOfAll],
          hand: [suddenChill],
          inkwell: suddenChill.cost,
          deck: 3,
        },
        {
          hand: [moanaOfMotunui, liloMakingAWish],
        },
      );

      const handDisruption = testStore.getByZoneAndId("hand", suddenChill.id);
      const target = testStore.getByZoneAndId(
        "hand",
        liloMakingAWish.id,
        "player_two",
      );

      handDisruption.playFromHand();

      testStore.changePlayer("player_two");
      testStore.resolveTopOfStack({ targets: [target] }, true);
      expect(target.zone).toEqual("discard");

      testStore.changePlayer("player_one");
      testStore.resolveOptionalAbility();
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 2,
          discard: 1,
        }),
      );
    });

    it("Opponent discarding Two cards", () => {
      const testStore = new TestStore(
        {
          play: [princeJohnGreediestOfAll],
          hand: [youHaveForgottenMe],
          inkwell: youHaveForgottenMe.cost,
          deck: 3,
        },
        {
          hand: [moanaOfMotunui, liloMakingAWish, stichtNewDog],
        },
      );

      const handDisruption = testStore.getByZoneAndId(
        "hand",
        youHaveForgottenMe.id,
      );
      const target = testStore.getByZoneAndId(
        "hand",
        liloMakingAWish.id,
        "player_two",
      );
      const target2 = testStore.getByZoneAndId(
        "hand",
        stichtNewDog.id,
        "player_two",
      );

      handDisruption.playFromHand();

      testStore.changePlayer("player_two");
      testStore.resolveTopOfStack({ targets: [target, target2] }, true);
      expect(target.zone).toEqual("discard");
      expect(target2.zone).toEqual("discard");

      expect(testStore.stackLayers).toHaveLength(2);

      testStore.changePlayer("player_one");
      testStore.resolveOptionalAbility();
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          deck: 2,
          hand: 1,
          discard: 1,
        }),
      );

      testStore.resolveOptionalAbility();
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          deck: 1,
          hand: 2,
          discard: 1,
        }),
      );

      expect(testStore.stackLayers).toHaveLength(0);
    });
  });
});
