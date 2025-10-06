/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { amberChromiconItem } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";

describe("Amber Chromicon", () => {
  it.skip("AMBER LIGHT", () => {
    const testStore = new TestStore({
      inkwell: amberChromiconItem.cost,
      play: [amberChromiconItem],
    });

    const cardUnderTest = testStore.getCard(amberChromiconItem);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
