import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { daisyDuckMusketeerSpy } from "./011-daisy-duck-musketeer-spy";

describe("Daisy Duck - Musketeer Spy", () => {
  it.skip("INFILTRATION When you play this character, each opponent chooses and discards a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: daisyDuckMusketeerSpy.cost,
      hand: [daisyDuckMusketeerSpy],
    });

    await testEngine.playCard(daisyDuckMusketeerSpy);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
