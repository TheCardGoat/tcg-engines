/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { obscurosphere } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Obscurosphere", () => {
  it.skip("**EXTRACT OF EMERALD** 2 {I}, Banish this item – Your characters gain **Ward** until the start of your next turn. _(Opponents can't choose them except to challenge.)_", () => {
    const testStore = new TestStore({
      inkwell: obscurosphere.cost,
      play: [obscurosphere],
    });

    const cardUnderTest = testStore.getCard(obscurosphere);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
