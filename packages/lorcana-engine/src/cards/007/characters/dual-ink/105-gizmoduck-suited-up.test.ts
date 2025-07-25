/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { robinHoodCapableFighter } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { gizmoduckSuitedUp } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Resist +1 (Damage dealt to this character is reduced by 1.)", () => {
  it.skip("", async () => {
    const testEngine = new TestEngine({
      play: [gizmoduckSuitedUp],
    });

    const cardUnderTest = testEngine.getCardModel(gizmoduckSuitedUp);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
describe("BLATHERING BLATHERSKITE This character can challenge ready damaged characters.", () => {
  it("can challenge ready damaged characters", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 10,
        play: [gizmoduckSuitedUp],
        hand: [],
      },
      {
        inkwell: 10,
        play: [robinHoodCapableFighter],
      },
    );

    const cardUnderTest = testEngine.getCardModel(gizmoduckSuitedUp);
    const defender = testEngine.getCardModel(robinHoodCapableFighter);

    defender.damage = 2;

    expect(defender.damage).toEqual(2);

    expect(defender.ready).toBe(true);

    expect(cardUnderTest.canChallenge(defender)).toBe(true);

    cardUnderTest.challenge(defender);
  });

  it("can't challenge ready not damaged characters", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 10,
        play: [gizmoduckSuitedUp],
        hand: [],
      },
      {
        inkwell: 10,
        play: [robinHoodCapableFighter],
      },
    );

    const cardUnderTest = testEngine.getCardModel(gizmoduckSuitedUp);
    const defender = testEngine.getCardModel(robinHoodCapableFighter);

    expect(defender.damage).toEqual(0);

    expect(defender.ready).toBe(true);

    expect(cardUnderTest.canChallenge(defender)).toBe(false);
  });
});
