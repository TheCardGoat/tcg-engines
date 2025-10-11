import { describe, it } from "bun:test";
import { jasmineRebelliousPrincess } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jasmine - Rebellious Princess", () => {
  it.skip("YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: jasmineRebelliousPrincess.cost,
      play: [jasmineRebelliousPrincess],
      hand: [jasmineRebelliousPrincess],
    });

    await testEngine.playCard(jasmineRebelliousPrincess);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
