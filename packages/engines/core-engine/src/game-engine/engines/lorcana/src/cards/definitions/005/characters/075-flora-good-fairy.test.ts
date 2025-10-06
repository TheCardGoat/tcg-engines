/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { floraGoodFairy } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

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
