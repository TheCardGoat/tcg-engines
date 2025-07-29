import { describe, expect, it } from "bun:test";
import { theMostDiabolicalScheme } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  gastonBaritoneBully,
  goofyKnightForADay,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
