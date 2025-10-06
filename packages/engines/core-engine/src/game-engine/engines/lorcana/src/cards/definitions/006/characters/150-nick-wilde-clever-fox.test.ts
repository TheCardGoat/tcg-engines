/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  madHattersTeapot,
  nickWildeCleverFox,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006";

describe("Nick Wilde - Clever Fox", () => {
  it("Shift 1 (You may pay 1 {I} to play this on top of one of your characters named Nick Wilde.)", async () => {
    const testEngine = new TestEngine({
      play: [nickWildeCleverFox],
    });

    const cardUnderTest = testEngine.getCardModel(nickWildeCleverFox);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("CAN'T TOUCH ME While you have an item in play, this character can't be challenged.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: madHattersTeapot.cost,
        hand: [madHattersTeapot],
        play: [nickWildeCleverFox],
      },
      {
        play: [goofyKnightForADay],
        deck: 2,
      },
    );

    const cardUnderTest = testEngine.getCardModel(nickWildeCleverFox);
    const challenger = testEngine.getCardModel(goofyKnightForADay);

    await testEngine.tapCard(nickWildeCleverFox);

    expect(cardUnderTest.canBeChallenged(challenger)).toEqual(true);
    expect(challenger.canChallenge(cardUnderTest)).toEqual(true);

    await testEngine.playCard(madHattersTeapot);

    expect(cardUnderTest.canBeChallenged(challenger)).toEqual(false);
    expect(challenger.canChallenge(cardUnderTest)).toEqual(false);
  });
});
