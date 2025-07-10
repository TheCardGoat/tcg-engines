/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { stabbingtonBrotherWithoutAPatch } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Stabbington Brother - Without a Patch", () => {
  it.skip("Rush (This character can challenge the turn they're played.) GET 'EM! Your other characters named Stabbington Brother gain Rush.", async () => {
    const testEngine = new TestEngine({
      play: [stabbingtonBrotherWithoutAPatch],
    });

    const cardUnderTest = testEngine.getCardModel(
      stabbingtonBrotherWithoutAPatch,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
