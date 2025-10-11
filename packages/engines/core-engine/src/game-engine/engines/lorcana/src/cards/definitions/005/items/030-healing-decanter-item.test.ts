import { describe, it } from "bun:test";
import { healingDecanterItem } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Healing Decanter - Item", () => {
  it.skip("**RENEWING ESSENCE** {E} – Remove up to 2 damage from chosen character.", () => {
    const testStore = new TestStore({
      inkwell: healingDecanterItem.cost,
      play: [healingDecanterItem],
    });

    const cardUnderTest = testStore.getCard(healingDecanterItem);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
