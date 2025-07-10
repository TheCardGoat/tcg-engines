/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { lostInTheWoods } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Lost in the Woods", () => {
  it.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_All opposing characters get -2 {S} until the start of your next turn.", () => {
    const testStore = new TestStore({
      inkwell: lostInTheWoods.cost,
      hand: [lostInTheWoods],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", lostInTheWoods.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
