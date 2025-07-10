/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { treasuresUntold } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Treasures Untold", () => {
  it.skip("_(A character with cost 6 or more can {E} to sing this song for free.)_Return up to 2 item cards from your discard into your hand.", () => {
    const testStore = new TestStore({
      inkwell: treasuresUntold.cost,
      hand: [treasuresUntold],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", treasuresUntold.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
