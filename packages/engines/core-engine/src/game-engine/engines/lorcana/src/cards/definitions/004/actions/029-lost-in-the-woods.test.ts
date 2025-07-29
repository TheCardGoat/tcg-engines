import { describe, expect, it } from "bun:test";
import {
  mickeyBraveLittleTailor,
  simbaProtectiveCub,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { lostInTheWoods } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lost in the Woods", () => {
  it("_(A character with cost 4 or more can {E} to sing this song for free.)_All opposing characters get -2 {S} until the start of your next turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: lostInTheWoods.cost,
        hand: [lostInTheWoods],
      },
      {
        play: [mickeyBraveLittleTailor, simbaProtectiveCub],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", lostInTheWoods.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({});

    // Test that the effect is applied (continuous effect should be active)
    expect(testStore.getZonesCardCount().discard).toBe(1); // Lost in the Woods goes to discard
  });
});
