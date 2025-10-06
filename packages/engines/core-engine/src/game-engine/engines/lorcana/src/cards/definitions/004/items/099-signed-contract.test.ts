/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { signedContract } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";

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
