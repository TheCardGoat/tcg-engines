/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { marchHareAbsurdHost } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("March Hare - Absurd Host", () => {
  it.skip("Rush (This character can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      play: [marchHareAbsurdHost],
    });

    const cardUnderTest = testEngine.getCardModel(marchHareAbsurdHost);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
