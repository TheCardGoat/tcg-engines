import { describe, expect, it } from "bun:test";
import { iFindEmIFlattenEm } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("I Find 'Em, I Flatten 'Em", () => {
  it.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_Banish all items.", () => {
    const testStore = new TestStore({
      inkwell: iFindEmIFlattenEm.cost,
      hand: [iFindEmIFlattenEm],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      iFindEmIFlattenEm.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
