import { describe, expect, it } from "bun:test";
import { theBossIsOnARoll } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Boss Is on a Roll", () => {
  it.skip("_(A character with cost 3 or more can {E} to sing this song for free.)_Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.", () => {
    const testStore = new TestStore({
      inkwell: theBossIsOnARoll.cost,
      hand: [theBossIsOnARoll],
    });

    const cardUnderTest = testStore.getCard(theBossIsOnARoll);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
