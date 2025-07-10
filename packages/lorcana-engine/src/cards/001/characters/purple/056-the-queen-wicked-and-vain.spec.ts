/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import {
  maleficentSorceress,
  theQueenWickedAndVain,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Queen - Wicked and Vain", () => {
  it("**I SUMMON THEE** {E} − Draw a card.", () => {
    const testStore = new TestStore({
      deck: [youHaveForgottenMe],
      play: [theQueenWickedAndVain],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      theQueenWickedAndVain.id,
    );

    cardUnderTest.activate();

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
    );
  });
});
