/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  gadgetHackwrenchCreativeThinker,
  mrBigShrewdTycoon,
  tukTukBigBuddy,
} from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
