/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions.ts";
import {
  aladdinHeroicOutlaw,
  heiheiBoatSnack,
  magicBroomBucketBrigade,
  mickeyMouseTrueFriend,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("You Have Forgotten Me", () => {
  it("discard 2 cards", () => {
    const testStore = new TestStore(
      {
        inkwell: youHaveForgottenMe.cost,
        hand: [youHaveForgottenMe],
      },
      {
        hand: [
          magicBroomBucketBrigade,
          aladdinHeroicOutlaw,
          heiheiBoatSnack,
          mickeyMouseTrueFriend,
        ],
      },
    );
    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      youHaveForgottenMe.id,
    );

    const cardToDiscard1 = testStore.getByZoneAndId(
      "hand",
      heiheiBoatSnack.id,
      "player_two",
    );
    const cardToDiscard2 = testStore.getByZoneAndId(
      "hand",
      mickeyMouseTrueFriend.id,
      "player_two",
    );

    cardUnderTest.playFromHand();

    testStore.changePlayer("player_two");
    testStore.resolveTopOfStack({
      targets: [cardToDiscard1, cardToDiscard2],
    });

    expect(cardToDiscard1.zone).toEqual("discard");
    expect(cardToDiscard2.zone).toEqual("discard");

    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ hand: 0, discard: 1 }),
    );
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 2, deck: 0, discard: 2 }),
    );
  });

  it("passed priority to opponent", () => {
    const testStore = new TestStore(
      {
        inkwell: youHaveForgottenMe.cost,
        hand: [youHaveForgottenMe],
      },
      {
        hand: [
          magicBroomBucketBrigade,
          aladdinHeroicOutlaw,
          heiheiBoatSnack,
          mickeyMouseTrueFriend,
        ],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      youHaveForgottenMe.id,
    );

    cardUnderTest.playFromHand();
    expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
    expect(testStore.store.stackLayerStore.layers[0]?.responder).toEqual(
      "player_two",
    );
    expect(testStore.store.priorityPlayer).toEqual("player_two");
  });
});
