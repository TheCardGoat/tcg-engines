import { describe, it } from "bun:test";
import { clarabelleContentedWallflower } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Clarabelle - Contented Wallflower", () => {
  it.skip("**ONE STEP BEHIND** When you play this character, if an opponent has more cards in their hand than you, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: clarabelleContentedWallflower.cost,
      hand: [clarabelleContentedWallflower],
    });

    const cardUnderTest = testStore.getCard(clarabelleContentedWallflower);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
