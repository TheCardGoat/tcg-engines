/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { rubyChromicon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";
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
