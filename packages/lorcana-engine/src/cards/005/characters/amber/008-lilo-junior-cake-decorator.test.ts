/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Lilo - Junior Cake Decorator", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: liloJuniorCakeDecorator.cost,
      play: [liloJuniorCakeDecorator],
    });

    const cardUnderTest = testStore.getCard(liloJuniorCakeDecorator);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
