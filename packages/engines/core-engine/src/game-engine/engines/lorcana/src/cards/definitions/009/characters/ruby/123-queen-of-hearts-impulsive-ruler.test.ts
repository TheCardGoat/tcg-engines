/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { queenOfHeartsImpulsiveRuler } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Queen of Hearts - Impulsive Ruler", () => {
  it.skip("**Rush** _(This character can challenge the turn they're played.)_", async () => {
    const testEngine = new TestEngine({
      play: [queenOfHeartsImpulsiveRuler],
    });

    const cardUnderTest = testEngine.getCardModel(queenOfHeartsImpulsiveRuler);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
