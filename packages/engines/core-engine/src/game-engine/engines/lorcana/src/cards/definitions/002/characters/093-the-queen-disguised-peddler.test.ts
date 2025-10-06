/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  goofyKnightForADay,
  theQueenDisguisedPeddler,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Queen - Disguised Peddler", () => {
  it("**A PERFECT DISGUISE** {E}, Choose and discard a character card − Gain lore equal to the discarded character's {L}.", () => {
    const testStore = new TestStore({
      play: [theQueenDisguisedPeddler],
      hand: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      theQueenDisguisedPeddler.id,
    );
    const target = testStore.getByZoneAndId("hand", goofyKnightForADay.id);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
    expect(testStore.getPlayerLore()).toEqual(target.lore);
  });
});
