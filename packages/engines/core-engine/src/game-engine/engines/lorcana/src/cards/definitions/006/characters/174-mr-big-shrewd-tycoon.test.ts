import { describe, expect, it } from "bun:test";
import {
  gadgetHackwrenchCreativeThinker,
  mrBigShrewdTycoon,
  tukTukBigBuddy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mr. Big - Shrewd Tycoon", () => {
  it("REPUTATION This character can't be challenged by characters with 2 {S} or more.", async () => {
    const cardWithOneStr = gadgetHackwrenchCreativeThinker;
    const cardWith6Str = tukTukBigBuddy;

    const testEngine = new TestEngine(
      {
        play: [cardWithOneStr, cardWith6Str],
      },
      {
        play: [mrBigShrewdTycoon],
      },
    );

    await testEngine.tapCard(mrBigShrewdTycoon);

    expect(
      testEngine
        .getCardModel(cardWithOneStr)
        .canChallenge(testEngine.getCardModel(mrBigShrewdTycoon)),
    ).toEqual(true);
    expect(
      testEngine
        .getCardModel(cardWith6Str)
        .canChallenge(testEngine.getCardModel(mrBigShrewdTycoon)),
    ).toEqual(false);
  });
});
