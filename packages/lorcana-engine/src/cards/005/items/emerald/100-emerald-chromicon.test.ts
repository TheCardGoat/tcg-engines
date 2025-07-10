/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { emeraldChromiconItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Emerald Chromicon", () => {
  it.skip("Emerald Light", () => {
    const testStore = new TestStore({
      inkwell: emeraldChromiconItem.cost,
      play: [emeraldChromiconItem],
    });

    const cardUnderTest = testStore.getCard(emeraldChromiconItem);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
