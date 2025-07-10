/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { scarTempestuousLion } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
