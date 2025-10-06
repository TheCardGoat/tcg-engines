/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { aladdinIntrepidCommander } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Aladdin - Intrepid Commander", () => {
  it.skip("Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aladdin.)", async () => {
    const testEngine = new TestEngine({
      play: [aladdinIntrepidCommander],
    });

    const cardUnderTest = testEngine.getCardModel(aladdinIntrepidCommander);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("REMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: aladdinIntrepidCommander.cost,
      hand: [aladdinIntrepidCommander],
    });

    await testEngine.playCard(aladdinIntrepidCommander);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
