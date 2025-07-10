/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { signedContract } from "@lorcanito/lorcana-engine/cards/004/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Signed Contract", () => {
  it.skip("**FINE PRINT** Whenever an opponent plays a song, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: signedContract.cost,
      play: [signedContract],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", signedContract.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
