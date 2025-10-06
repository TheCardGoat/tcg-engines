/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { basilsMagnifyingGlass } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Basil's Magnifying Glass", () => {
  it.skip("**FIND WHAT’S HIDDEN** {E}, 2 {I} - Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.", () => {
    const testStore = new TestStore({
      inkwell: basilsMagnifyingGlass.cost,
      play: [basilsMagnifyingGlass],
    });

    const cardUnderTest = testStore.getCard(basilsMagnifyingGlass);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
