/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { liloJuniorCakeDecorator } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

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
