/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  hadesKingOfOlympus,
  maleficentUninvited,
  scarFieryUsurper,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hades - King of Olympus", () => {
  // TODO: Fix this test
  it.skip("**Sinister plot** This character gets +1 {L} for every other Villain character you have in play.", () => {
    const testStore = new TestStore(
      {
        inkwell: maleficentUninvited.cost + scarFieryUsurper.cost,
        hand: [maleficentUninvited, scarFieryUsurper],
        play: [hadesKingOfOlympus],
        deck: 1,
      },
      { deck: 1 },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      hadesKingOfOlympus.id,
    );
    const targetCard = testStore.getByZoneAndId("hand", maleficentUninvited.id);
    const anotherCard = testStore.getByZoneAndId("hand", scarFieryUsurper.id);

    expect(cardUnderTest.strength).toEqual(6);

    targetCard.playFromHand();
    expect(cardUnderTest.strength).toEqual(7);

    anotherCard.playFromHand();
    expect(cardUnderTest.strength).toEqual(8);
  });

  it("**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Hades._)", () => {
    const testStore = new TestStore({
      play: [hadesKingOfOlympus],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      hadesKingOfOlympus.id,
    );
    expect(cardUnderTest.hasShift).toEqual(true);
  });
});
