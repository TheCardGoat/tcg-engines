/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mufasaAmongTheStars } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Mufasa - Among the Stars", () => {
  it.skip("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mufasa.)", async () => {
    const testEngine = new TestEngine({
      play: [mufasaAmongTheStars],
    });

    const cardUnderTest = testEngine.getCardModel(mufasaAmongTheStars);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [mufasaAmongTheStars],
    });

    const cardUnderTest = testEngine.getCardModel(mufasaAmongTheStars);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      play: [mufasaAmongTheStars],
    });

    const cardUnderTest = testEngine.getCardModel(mufasaAmongTheStars);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
