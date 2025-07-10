/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import {
  aladdinHeroicOutlaw,
  elsaSpiritOfWinter,
  heiheiBoatSnack,
  johnSilverAlienPirate,
  liloMakingAWish,
  magicBroomBucketBrigade,
  pascalRapunzelCompanion,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { elsaSpiritOfWinterTargetingOneCharacterTestCase } from "@lorcanito/lorcana-engine/cards/001/characters/purple/042-elsa-spirit-of-winter.spec";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Multiple targets", () => {
  it("discard 1 cards, having 2 cards in hand", () => {
    const testStore = new TestStore(
      {
        inkwell: youHaveForgottenMe.cost,
        hand: [youHaveForgottenMe],
      },
      {
        hand: [magicBroomBucketBrigade, aladdinHeroicOutlaw],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      youHaveForgottenMe.id,
    );

    const cardToDiscard = testStore.getByZoneAndId(
      "hand",
      magicBroomBucketBrigade.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.changePlayer("player_two");
    testStore.resolveTopOfStack(
      {
        targets: [cardToDiscard],
      },
      true,
    );

    expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 2, deck: 0, discard: 0 }),
    );
  });

  it("discard 1 card, having only one card in hand", () => {
    const testStore = new TestStore(
      {
        inkwell: youHaveForgottenMe.cost,
        hand: [youHaveForgottenMe],
      },
      {
        hand: [heiheiBoatSnack],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      youHaveForgottenMe.id,
    );

    const toDiscard = testStore.getByZoneAndId(
      "hand",
      heiheiBoatSnack.id,
      "player_two",
    );
    cardUnderTest.playFromHand();
    testStore.changePlayer("player_two");
    testStore.resolveTopOfStack({
      targets: [toDiscard],
    });

    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 0, deck: 0, discard: 1 }),
    );
    expect(toDiscard.zone).toEqual("discard");
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });

  it("discard 0 cards, no cards in hand", () => {
    const testStore = new TestStore(
      {
        inkwell: youHaveForgottenMe.cost,
        hand: [youHaveForgottenMe],
      },
      {
        hand: [],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      youHaveForgottenMe.id,
    );

    cardUnderTest.playFromHand();

    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 0, deck: 0, discard: 0 }),
    );
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });
});

describe("'Up to' targets", () => {
  it("Targeting MORE than it should in a 'up to' target ", () => {
    const testStore = new TestStore(
      {
        inkwell: elsaSpiritOfWinter.cost,
        hand: [elsaSpiritOfWinter],
        deck: 3,
      },
      {
        deck: 3,
        play: [pascalRapunzelCompanion, johnSilverAlienPirate, liloMakingAWish],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      elsaSpiritOfWinter.id,
    );
    const targetOne = testStore.getByZoneAndId(
      "play",
      pascalRapunzelCompanion.id,
      "player_two",
    );
    const targetTwo = testStore.getByZoneAndId(
      "play",
      johnSilverAlienPirate.id,
      "player_two",
    );
    const targetThree = testStore.getByZoneAndId(
      "play",
      liloMakingAWish.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack(
      {
        targets: [targetOne, targetTwo, targetThree],
      },
      true,
    );

    expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
  });

  it("Targeting LESS than it should in a 'up to' target ", () => {
    elsaSpiritOfWinterTargetingOneCharacterTestCase();
  });
});
