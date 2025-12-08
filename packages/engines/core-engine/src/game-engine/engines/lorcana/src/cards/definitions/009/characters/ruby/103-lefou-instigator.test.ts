import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { lefouInstigator } from "./103-lefou-instigator";

describe("Lefou - Instigator", () => {
  it.skip("**FAN THE FLAMES** When you play this character, ready chosen character. They can't quest for the rest of this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: lefouInstigator.cost,
      hand: [lefouInstigator],
    });

    await testEngine.playCard(lefouInstigator);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
