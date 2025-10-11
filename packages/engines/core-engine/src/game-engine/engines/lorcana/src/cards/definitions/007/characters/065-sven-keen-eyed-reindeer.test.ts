import { describe, expect, it } from "bun:test";
import { svenKeeneyedReindeer } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sven - Keen-Eyed Reindeer", () => {
  it.skip("Rush (This character can challenge the turn they’re played.)", async () => {
    const testEngine = new TestEngine({
      play: [svenKeeneyedReindeer],
    });

    const cardUnderTest = testEngine.getCardModel(svenKeeneyedReindeer);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it.skip("FORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: svenKeeneyedReindeer.cost,
      hand: [svenKeeneyedReindeer],
    });

    await testEngine.playCard(svenKeeneyedReindeer);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
