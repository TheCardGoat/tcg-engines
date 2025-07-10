/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { bosssOrders } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Boss’s Orders", () => {
  it.skip("Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      inkwell: bosssOrders.cost,
      hand: [bosssOrders],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", bosssOrders.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
