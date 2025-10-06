/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { princeNaveenVigilantFirstMate } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Prince Naveen - Vigilant First Mate", () => {
  it.skip("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)", async () => {
    const testEngine = new TestEngine({
      play: [princeNaveenVigilantFirstMate],
    });

    const cardUnderTest = testEngine.getCardModel(
      princeNaveenVigilantFirstMate,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [princeNaveenVigilantFirstMate],
    });

    const cardUnderTest = testEngine.getCardModel(
      princeNaveenVigilantFirstMate,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
