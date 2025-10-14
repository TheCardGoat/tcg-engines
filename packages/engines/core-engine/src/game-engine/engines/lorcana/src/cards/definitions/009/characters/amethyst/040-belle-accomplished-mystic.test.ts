import { describe, expect, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { belleAccomplishedMystic } from "./040-belle-accomplished-mystic";

describe("Belle - Accomplished Mystic", () => {
  it.skip("**Shift** 3", async () => {
    const testEngine = new TestEngine({
      play: [belleAccomplishedMystic],
    });

    const cardUnderTest = testEngine.getCardModel(belleAccomplishedMystic);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it.skip("**ENHANCED HEALING** When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: belleAccomplishedMystic.cost,
      hand: [belleAccomplishedMystic],
    });

    await testEngine.playCard(belleAccomplishedMystic);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
