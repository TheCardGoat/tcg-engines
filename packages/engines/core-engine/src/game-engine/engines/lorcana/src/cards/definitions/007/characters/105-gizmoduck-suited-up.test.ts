/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { robinHoodCapableFighter } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { gizmoduckSuitedUp } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
