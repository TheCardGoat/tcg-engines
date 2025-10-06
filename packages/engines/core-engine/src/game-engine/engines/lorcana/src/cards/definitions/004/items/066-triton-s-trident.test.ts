/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { tritonsTrident } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Triton's Trident", () => {
  it.skip("**SYMBOL OF POWER** Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.", () => {
    const testStore = new TestStore({
      inkwell: tritonsTrident.cost,
      play: [tritonsTrident],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", tritonsTrident.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
