/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { iceBlock } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";

describe("Ice Block", () => {
  it.skip("**CHILLY LABOR** {E} − Chosen character gets -1 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: iceBlock.cost,
      play: [iceBlock],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", iceBlock.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
