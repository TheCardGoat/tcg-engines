import { describe, it } from "bun:test";
import { svenReindeerSteed } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sven - Reindeer Steed", () => {
  it.skip("**REINDEER GAMES** When you play this character, you may ready chosen character. They can’t quest or challenge for the rest of this turn.", () => {
    const testStore = new TestStore({
      inkwell: svenReindeerSteed.cost,
      hand: [svenReindeerSteed],
    });

    const cardUnderTest = testStore.getCard(svenReindeerSteed);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
