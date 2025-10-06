/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { kodaTalkativeCub } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Koda - Talkative Cub", () => {
  it.skip("**TELL EVERYBODY** During opponents’ turns, you can’t lose lore.", () => {
    const testStore = new TestStore({
      inkwell: kodaTalkativeCub.cost,
      play: [kodaTalkativeCub],
    });

    const cardUnderTest = testStore.getCard(kodaTalkativeCub);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
