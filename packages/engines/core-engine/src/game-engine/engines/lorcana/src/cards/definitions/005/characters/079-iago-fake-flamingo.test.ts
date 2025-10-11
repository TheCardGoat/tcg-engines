import { describe, it } from "bun:test";
import { iagoFakeFlamingo } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Iago - Fake Flamingo", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: iagoFakeFlamingo.cost,
      play: [iagoFakeFlamingo],
    });

    const cardUnderTest = testStore.getCard(iagoFakeFlamingo);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
