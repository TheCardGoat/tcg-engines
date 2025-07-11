/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { iFindEmIFlattenEm } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
