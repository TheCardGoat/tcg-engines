/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { arthurNoviceSparrow } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Arthur - Novice Sparrow", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: arthurNoviceSparrow.cost,
      play: [arthurNoviceSparrow],
    });

    const cardUnderTest = testStore.getCard(arthurNoviceSparrow);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
