/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { brunosReturn } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Bruno's Return", () => {
  it.skip("Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.", () => {
    const testStore = new TestStore({
      inkwell: brunosReturn.cost,
      hand: [brunosReturn],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", brunosReturn.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
