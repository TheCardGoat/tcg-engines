/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { abuBoldHelmsman } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Abu - Bold Helmsman", () => {
  it.skip("Rush (This character can challenge the turn they’re played.)", async () => {
    const testEngine = new TestEngine({
      play: [abuBoldHelmsman],
    });

    const cardUnderTest = testEngine.getCardModel(abuBoldHelmsman);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
