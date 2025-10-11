/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { youHaveForgottenMe } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { theQueenWickedAndVain } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
