import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { belleUntrainedMystic } from "./039-belle-untrained-mystic";

describe("Belle - Untrained Mystic", () => {
  it.skip("**HERE NOW, DON'T DO THAT** When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: belleUntrainedMystic.cost,
      hand: [belleUntrainedMystic],
    });

    await testEngine.playCard(belleUntrainedMystic);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
