import { describe, expect, it } from "bun:test";
import { lookAtThisFamily } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Look At This Family", () => {
  it.skip("**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.", () => {
    const testStore = new TestStore({
      inkwell: lookAtThisFamily.cost,
      hand: [lookAtThisFamily],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", lookAtThisFamily.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
