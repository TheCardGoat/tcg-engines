import { describe, it } from "bun:test";
import { lefouInstigator } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
