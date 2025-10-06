/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { razoulPalaceGuard } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Razoul - Palace Guard", () => {
  it.skip("**LOOKY HERE** While this character has no damage, he gets +2 {S}.", () => {
    const testStore = new TestStore({
      inkwell: razoulPalaceGuard.cost,
      play: [razoulPalaceGuard],
    });

    const cardUnderTest = testStore.getCard(razoulPalaceGuard);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
