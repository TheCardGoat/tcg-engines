import { describe, it } from "bun:test";
import { sleepySluggishKnight } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sleepy - Sluggish Knight", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: sleepySluggishKnight.cost,
      play: [sleepySluggishKnight],
    });

    const cardUnderTest = testStore.getCard(sleepySluggishKnight);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
