/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { minnieMouseDaringDefender } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Minnie Mouse - Daring Defender", () => {
  it("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [minnieMouseDaringDefender],
    });

    const cardUnderTest = testEngine.getCardModel(minnieMouseDaringDefender);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it("TRUE VALOR This character gets +1 {S} for each 1 damage on her.", async () => {
    const testEngine = new TestEngine({
      play: [minnieMouseDaringDefender],
    });

    const cardToTest = testEngine.getCardModel(minnieMouseDaringDefender);
    cardToTest.damage = 2;

    expect(cardToTest.strength).toBe(2);
  });
});
