/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { minnieMouseQuickthinkingInventor } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Minnie Mouse - Quick-Thinking Inventor", () => {
  it.skip("**CAKE CATAPULT** When you play this character, chosen character gets -2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: minnieMouseQuickthinkingInventor.cost,
      hand: [minnieMouseQuickthinkingInventor],
    });

    const cardUnderTest = testStore.getCard(minnieMouseQuickthinkingInventor);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
