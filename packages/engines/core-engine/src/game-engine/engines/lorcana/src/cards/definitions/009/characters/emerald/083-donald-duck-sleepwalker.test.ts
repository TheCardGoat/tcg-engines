import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { donaldDuckSleepwalker } from "./083-donald-duck-sleepwalker";

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
