/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { earthGiantLivingMountain } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Earth Giant - Living Mountain", () => {
  it("**UNEARTHED** When you play this character, each opponent draws a card.", () => {
    const testStore = new TestStore(
      {
        inkwell: earthGiantLivingMountain.cost,
        hand: [earthGiantLivingMountain],
      },
      {
        deck: 1,
      },
    );

    const cardUnderTest = testStore.getCard(earthGiantLivingMountain);
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({});

    expect(testStore.getZonesCardCount("player_two").hand).toEqual(1);
    expect(testStore.getZonesCardCount("player_two").deck).toEqual(0);
  });
});
