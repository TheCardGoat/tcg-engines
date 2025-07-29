import { describe, expect, it } from "bun:test";
import { seldomAllTheySeem } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
