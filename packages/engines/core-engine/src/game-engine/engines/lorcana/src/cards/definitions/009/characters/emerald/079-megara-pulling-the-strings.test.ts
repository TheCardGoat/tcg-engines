import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { megaraPullingTheStrings } from "./079-megara-pulling-the-strings";

describe("Megara - Pulling the Strings", () => {
  it.skip("WONDER BOY When you play this character, chosen character gets +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: megaraPullingTheStrings.cost,
      hand: [megaraPullingTheStrings],
    });

    await testEngine.playCard(megaraPullingTheStrings);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
