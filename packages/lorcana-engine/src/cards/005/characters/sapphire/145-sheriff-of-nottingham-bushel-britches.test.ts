/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { sheriffOfNottinghamBushelBritches } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
