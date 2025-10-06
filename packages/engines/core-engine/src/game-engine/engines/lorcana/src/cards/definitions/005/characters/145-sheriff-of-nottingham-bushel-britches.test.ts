/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { sheriffOfNottinghamBushelBritches } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Sheriff of Nottingham - Bushel Britches", () => {
  it("**EVERY LITTLE BIT HELPS** For each item you have in play, you pay 1 {I} less to play this character.", () => {
    const testStore = new TestStore({
      inkwell: sheriffOfNottinghamBushelBritches.cost,
      hand: [sheriffOfNottinghamBushelBritches],
      play: [pawpsicle, pawpsicle, pawpsicle],
    });

    const cardUnderTest = testStore.getCard(sheriffOfNottinghamBushelBritches);

    cardUnderTest.playFromHand();
    expect(cardUnderTest.zone).toEqual("play");
    expect(testStore.getAvailableInkwellCardCount()).toEqual(3);
  });
});
