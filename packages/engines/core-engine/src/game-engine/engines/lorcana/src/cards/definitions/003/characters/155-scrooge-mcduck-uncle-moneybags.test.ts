import { describe, it } from "bun:test";
import { scroogeMcduckUncleMoneybags } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scrooge McDuck - Uncle Moneybags", () => {
  it.skip("TREASURE FINDER  Whenever this character quests, you pay 1 {I} less for the next item you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: scroogeMcduckUncleMoneybags.cost,
      play: [scroogeMcduckUncleMoneybags],
    });

    const cardUnderTest = testStore.getCard(scroogeMcduckUncleMoneybags);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
