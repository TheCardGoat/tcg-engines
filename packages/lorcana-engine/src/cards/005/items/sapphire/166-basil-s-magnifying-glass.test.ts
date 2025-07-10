/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { basilsMagnifyingGlass } from "@lorcanito/lorcana-engine/cards/005/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Basil's Magnifying Glass", () => {
  it.skip("FIND WHAT’S HIDDEN", () => {
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
