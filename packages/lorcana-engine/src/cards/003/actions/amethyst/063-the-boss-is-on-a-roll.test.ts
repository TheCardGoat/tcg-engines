/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theBossIsOnARoll } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
