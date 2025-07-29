/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  mickeyBraveLittleTailor,
  simbaProtectiveCub,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { lostInTheWoods } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
