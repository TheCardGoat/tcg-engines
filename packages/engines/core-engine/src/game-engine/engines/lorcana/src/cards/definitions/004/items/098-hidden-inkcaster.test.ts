/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { hiddenInkcaster } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";

describe("Hidden Inkcaster", () => {
  it.skip("**FRESH INK** When you play this item, draw a card.**UNEXPECTED TREASURE** All cards in your hand count as having ⏣.", () => {
    const testStore = new TestStore({
      inkwell: hiddenInkcaster.cost,
      play: [hiddenInkcaster],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", hiddenInkcaster.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
