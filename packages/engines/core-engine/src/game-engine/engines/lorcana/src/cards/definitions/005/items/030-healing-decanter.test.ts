/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { healingDecanterItem } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Healing Decanter", () => {
  it.skip("RENEWING ESSENCE", () => {
    const testStore = new TestStore({
      inkwell: healingDecanterItem.cost,
      play: [healingDecanterItem],
    });

    const cardUnderTest = testStore.getCard(healingDecanterItem);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
