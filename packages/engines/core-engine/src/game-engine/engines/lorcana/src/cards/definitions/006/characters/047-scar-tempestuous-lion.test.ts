/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { scarTempestuousLion } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scar - Tempestuous Lion", () => {
  it.skip("Rush (This character can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      play: [scarTempestuousLion],
    });

    const cardUnderTest = testEngine.getCardModel(scarTempestuousLion);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it.skip("Challenger +3 (While challenging, this character gets +3 {S}.)", async () => {
    const testEngine = new TestEngine({
      play: [scarTempestuousLion],
    });

    const cardUnderTest = testEngine.getCardModel(scarTempestuousLion);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
