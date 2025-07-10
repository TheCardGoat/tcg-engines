/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { denahiImpatientHunter } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Denahi - Impatient Hunter", () => {
  it.skip("Reckless (This character can’t quest and must challenge each turn if able.)", async () => {
    const testEngine = new TestEngine({
      play: [denahiImpatientHunter],
    });

    const cardUnderTest = testEngine.getCardModel(denahiImpatientHunter);
    expect(cardUnderTest.hasReckless).toBe(true);
  });

  it.skip("Resist +2 (Damage dealt to this character is reduced by 2.)", async () => {
    const testEngine = new TestEngine({
      play: [denahiImpatientHunter],
    });

    const cardUnderTest = testEngine.getCardModel(denahiImpatientHunter);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
