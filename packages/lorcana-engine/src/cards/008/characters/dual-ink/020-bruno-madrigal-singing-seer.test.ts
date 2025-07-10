/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import {
  brunoMadrigalSingingSeer,
  deweyLovableShowoff,
  lafayetteSleepyDachshund,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Bruno Madrigal - Singing Seer", () => {
  it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Bruno Madrigal.)", async () => {
    const testEngine = new TestEngine({
      play: [brunoMadrigalSingingSeer],
    });

    const cardUnderTest = testEngine.getCardModel(brunoMadrigalSingingSeer);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("BRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.", async () => {
    const testEngine = new TestEngine({
      play: [
        brunoMadrigalSingingSeer,
        lafayetteSleepyDachshund,
        deweyLovableShowoff,
      ],
      hand: [hakunaMatata],
    });

    await testEngine.singSong({
      singer: testEngine.getCardModel(brunoMadrigalSingingSeer),
      song: hakunaMatata,
    });

    await testEngine.resolveOptionalAbility();

    expect(testEngine.getCardsByZone("hand").length).toBe(
      testEngine.getCardsByZone("play").length,
    );
  });
});
