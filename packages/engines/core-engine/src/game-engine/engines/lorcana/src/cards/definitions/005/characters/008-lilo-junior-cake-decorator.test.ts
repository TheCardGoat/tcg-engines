import { describe, it } from "bun:test";
import { liloJuniorCakeDecorator } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
