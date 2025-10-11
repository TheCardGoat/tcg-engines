import { describe, it } from "bun:test";
import { zazuAdvisorToMufasa } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Zazu - Advisor to Mufasa", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: zazuAdvisorToMufasa.cost,
      play: [zazuAdvisorToMufasa],
    });

    const cardUnderTest = testStore.getCard(zazuAdvisorToMufasa);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
