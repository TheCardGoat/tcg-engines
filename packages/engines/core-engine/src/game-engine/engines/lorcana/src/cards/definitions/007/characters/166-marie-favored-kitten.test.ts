import { describe, it } from "bun:test";
import { marieFavoredKitten } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Marie - Favored Kitten", () => {
  it.skip("I'LL SHOW YOU Whenever this character quests, you may give chosen character -2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: marieFavoredKitten.cost,
      play: [marieFavoredKitten],
      hand: [marieFavoredKitten],
    });

    await testEngine.playCard(marieFavoredKitten);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
