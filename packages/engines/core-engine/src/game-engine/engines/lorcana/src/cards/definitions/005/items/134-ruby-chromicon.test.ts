/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { rubyChromicon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";

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
