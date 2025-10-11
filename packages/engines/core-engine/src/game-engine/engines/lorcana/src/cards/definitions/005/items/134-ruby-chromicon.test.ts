import { describe, it } from "bun:test";
import { rubyChromicon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ruby Chromicon", () => {
  it.skip("**RUBY LIGHT** {E} − Chosen character gets +1 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: rubyChromicon.cost,
      play: [rubyChromicon],
    });

    const cardUnderTest = testStore.getCard(rubyChromicon);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
