/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { daisyDuckSpotlessFoodfighter } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
