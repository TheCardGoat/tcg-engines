/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { theSwordReleased } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Sword Released", () => {
  it.skip("**POWER APPOINTED** At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.", () => {
    const testStore = new TestStore({
      inkwell: theSwordReleased.cost,
      play: [theSwordReleased],
    });

    const cardUnderTest = testStore.getCard(theSwordReleased);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
