/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { kenaiBigBrother } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Kenai - Big Brother", () => {
  it.skip("**BROTHERS FOREVER** While this character is exerted, your characters named Koda can’t be challenged.", () => {
    const testStore = new TestStore({
      inkwell: kenaiBigBrother.cost,
      play: [kenaiBigBrother],
    });

    const cardUnderTest = testStore.getCard(kenaiBigBrother);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
