/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { seldomAllTheySeem } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Seldom All They Seem", () => {
  it.skip("_(A character with cost 2 or more can {E} to sing this song for free.)_Chosen character gets -3 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: seldomAllTheySeem.cost,
      hand: [seldomAllTheySeem],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      seldomAllTheySeem.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
