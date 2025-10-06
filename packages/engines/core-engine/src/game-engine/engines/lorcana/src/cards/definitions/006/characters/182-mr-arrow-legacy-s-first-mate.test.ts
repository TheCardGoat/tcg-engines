/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mrArrowLegacysFirstMate } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Mr. Arrow - Legacy's First Mate", () => {
  it.skip("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      play: [mrArrowLegacysFirstMate],
    });

    const cardUnderTest = testEngine.getCardModel(mrArrowLegacysFirstMate);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
