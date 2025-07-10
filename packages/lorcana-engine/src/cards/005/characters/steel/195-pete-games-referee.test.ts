/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { peteGamesReferee } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Pete - Games Referee", () => {
  it("**BLOW THE WHISTLE** When you play this character, opponents can’t play actions until the start of your next turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: peteGamesReferee.cost,
        hand: [peteGamesReferee],
        deck: 1,
      },
      {
        deck: 7,
        hand: [
          friendsOnTheOtherSide,
          liloMakingAWish,
          forbiddenMountainMaleficentsCastle,
          dingleHopper,
        ],
        inkwell:
          friendsOnTheOtherSide.cost +
          liloMakingAWish.cost +
          forbiddenMountainMaleficentsCastle.cost +
          dingleHopper.cost,
      },
    );

    const cardUnderTest = testStore.getCard(peteGamesReferee);
    cardUnderTest.playFromHand();

    testStore.passTurn();

    const actionTarget = testStore.getCard(friendsOnTheOtherSide);
    const itemTarget = testStore.getCard(dingleHopper);
    const locationTarget = testStore.getCard(
      forbiddenMountainMaleficentsCastle,
    );
    const characterTarget = testStore.getCard(liloMakingAWish);

    actionTarget.playFromHand();
    expect(actionTarget.zone).toEqual("hand");

    itemTarget.playFromHand();
    expect(itemTarget.zone).toEqual("play");

    locationTarget.playFromHand();
    expect(locationTarget.zone).toEqual("play");

    characterTarget.playFromHand();
    expect(characterTarget.zone).toEqual("play");

    testStore.passTurn();
    testStore.passTurn();

    actionTarget.playFromHand();
    expect(actionTarget.zone).toEqual("discard");
  });
});
