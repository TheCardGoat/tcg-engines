/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theMostDiabolicalScheme } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import {
  gastonBaritoneBully,
  goofyKnightForADay,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Most Diabolical Scheme", () => {
  it("Banish chosen Villain of yours to banish chosen character.", () => {
    const testStore = new TestStore(
      {
        inkwell: theMostDiabolicalScheme.cost,
        hand: [theMostDiabolicalScheme],
        play: [gastonBaritoneBully],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      theMostDiabolicalScheme.id,
    );
    const villain = testStore.getByZoneAndId("play", gastonBaritoneBully.id);
    const target = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [villain] }, true);
    testStore.resolveTopOfStack({ targets: [target] });
  });
});
