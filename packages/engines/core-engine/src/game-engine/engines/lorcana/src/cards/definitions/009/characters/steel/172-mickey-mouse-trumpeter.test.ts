import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { mickeyMouseTrumpeter } from "./172-mickey-mouse-trumpeter";

describe("Mickey Mouse - Trumpeter", () => {
  it.skip("**BUGLE CALL** {E}, 2 {I} - Play a character for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: mickeyMouseTrumpeter.cost,
      play: [mickeyMouseTrumpeter],
      hand: [mickeyMouseTrumpeter],
    });

    await testEngine.playCard(mickeyMouseTrumpeter);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
