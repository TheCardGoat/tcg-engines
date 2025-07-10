/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { roseLantern } from "@lorcanito/lorcana-engine/cards/004/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Rose Lantern", () => {
  it.skip("MYSTERICAL PETALS  {E}, 2 {I} − Move 1 damage counter from chosen character to chosen opposing character.", () => {
    const testStore = new TestStore({
      inkwell: roseLantern.cost,
      play: [roseLantern],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", roseLantern.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
