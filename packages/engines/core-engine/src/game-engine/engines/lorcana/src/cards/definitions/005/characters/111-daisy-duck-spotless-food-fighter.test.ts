/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { daisyDuckSpotlessFoodfighter } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Daisy Duck - Spotless Food-Fighter", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: daisyDuckSpotlessFoodfighter.cost,
      play: [daisyDuckSpotlessFoodfighter],
    });

    const cardUnderTest = testStore.getCard(daisyDuckSpotlessFoodfighter);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
