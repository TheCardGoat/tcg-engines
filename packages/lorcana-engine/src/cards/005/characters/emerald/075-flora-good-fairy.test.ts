/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { floraGoodFairy } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Flora - Good Fairy", () => {
  it.skip("**FIDDLE FADDLE** While being challenged, this character gets +2 {S}.", () => {
    const testStore = new TestStore({
      inkwell: floraGoodFairy.cost,
      play: [floraGoodFairy],
    });

    const cardUnderTest = testStore.getCard(floraGoodFairy);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
