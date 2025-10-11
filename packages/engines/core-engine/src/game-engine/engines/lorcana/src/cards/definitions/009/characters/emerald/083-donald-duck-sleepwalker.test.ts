import { describe, it } from "bun:test";
import { donaldDuckSleepwalker } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Donald Duck - Sleepwalker", () => {
  it.skip("**STARTLED AWAKE** Whenever you play an action, this character gets +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: donaldDuckSleepwalker.cost,
      play: [donaldDuckSleepwalker],
      hand: [donaldDuckSleepwalker],
    });

    await testEngine.playCard(donaldDuckSleepwalker);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
