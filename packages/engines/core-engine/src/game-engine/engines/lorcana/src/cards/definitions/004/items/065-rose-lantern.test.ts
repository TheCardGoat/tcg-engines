/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { roseLantern } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";

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
