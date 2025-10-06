/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { friendsOnTheOtherSide } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { forbiddenMountainMaleficentsCastle } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/indext";
import { peteGamesReferee } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
