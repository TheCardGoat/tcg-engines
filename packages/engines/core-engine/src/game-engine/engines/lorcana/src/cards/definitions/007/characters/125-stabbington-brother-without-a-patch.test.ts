/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { stabbingtonBrotherWithoutAPatch } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
