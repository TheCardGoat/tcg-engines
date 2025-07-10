/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("A Pirate's Life", () => {
  it.skip("**Sing Together** 6 _(Any number of your of your teammates' characters with total cost 6 or more may {E} to sing this song for free.)_Each opponent loses 2 lore. You gain 2 lore.", () => {
    const testStore = new TestStore({
      inkwell: aPiratesLife.cost,
      hand: [aPiratesLife],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", aPiratesLife.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
