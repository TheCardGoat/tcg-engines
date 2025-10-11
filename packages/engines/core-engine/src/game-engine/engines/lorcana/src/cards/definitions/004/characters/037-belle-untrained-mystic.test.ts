import { describe, it } from "bun:test";
import { belleUntrainedMystic } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Belle - Untrained Mystic", () => {
  it.skip("**HERE NOW, DON'T DO THAT** When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.", () => {
    const testStore = new TestStore({
      inkwell: belleUntrainedMystic.cost,
      hand: [belleUntrainedMystic],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      belleUntrainedMystic.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
