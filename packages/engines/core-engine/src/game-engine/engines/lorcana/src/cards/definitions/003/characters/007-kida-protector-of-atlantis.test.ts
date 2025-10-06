/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  kidaProtectorOfAtlantis,
  kingLouieBandleader,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kida - Protector of Atlantis", () => {
  it("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Kida.)_**PERHAPS WE CAN SAVE OUR FUTURE** When you play this character, all characters get -3 {S} until the start of your next turn.", () => {
    const testStore = new TestStore({
      play: [kidaProtectorOfAtlantis],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      kidaProtectorOfAtlantis.id,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("**PERHAPS WE CAN SAVE OUR FUTURE** When you play this character, all characters get -3 {S} until the start of your next turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: kidaProtectorOfAtlantis.cost,
        hand: [kidaProtectorOfAtlantis],
        deck: 1,
      },
      {
        play: [kingLouieBandleader],
        deck: 1,
      },
    );

    const cardUnderTest = testStore.getCard(kidaProtectorOfAtlantis);
    const targetCard = testStore.getCard(kingLouieBandleader);

    cardUnderTest.play();
    expect(targetCard.strength).toBe(kingLouieBandleader.strength - 3);
    expect(cardUnderTest.strength).toBe(kidaProtectorOfAtlantis.strength - 3);

    testStore.passTurn();

    expect(targetCard.strength).toBe(kingLouieBandleader.strength - 3);
    expect(cardUnderTest.strength).toBe(kidaProtectorOfAtlantis.strength - 3);

    testStore.passTurn();

    expect(targetCard.strength).toBe(kingLouieBandleader.strength);
    expect(cardUnderTest.strength).toBe(kidaProtectorOfAtlantis.strength);
  });
});
