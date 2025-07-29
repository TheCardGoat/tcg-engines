/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { digALittleDeeper } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Dig A Little Deeper", () => {
  it.skip("**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_Look at the top 7 cards of your deck. Put 2 into your hand. Put the rest on teh bottom of your deck in any order.", () => {
    const testStore = new TestStore({
      inkwell: digALittleDeeper.cost,
      hand: [digALittleDeeper],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", digALittleDeeper.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
