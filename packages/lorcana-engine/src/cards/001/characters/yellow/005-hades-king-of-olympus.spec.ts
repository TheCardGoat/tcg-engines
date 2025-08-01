/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  hadesKingOfOlympus,
  maleficentUninvited,
  scarFieryUsurper,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
