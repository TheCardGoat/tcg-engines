import { describe, it } from "bun:test";
import { mrSmeeEfficientCaptain } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mr. Smee - Efficient Captain", () => {
  it.skip("PIPE UP THE CREW Whenever you play an action that isn’t a song, you may ready chosen Pirate character.", async () => {
    const testEngine = new TestEngine({
      inkwell: mrSmeeEfficientCaptain.cost,
      play: [mrSmeeEfficientCaptain],
      hand: [mrSmeeEfficientCaptain],
    });

    await testEngine.playCard(mrSmeeEfficientCaptain);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
