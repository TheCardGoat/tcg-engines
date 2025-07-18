/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloGalacticHero,
  stitchRockStar,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { iagoOutOfReach } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Iago - Out of Reach", () => {
  it("SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.", async () => {
    const testEngine = new TestEngine(
      {
        play: [iagoOutOfReach, stitchRockStar],
      },
      {
        play: [liloGalacticHero],
      },
    );

    const cardUnderTest = testEngine.getCardModel(iagoOutOfReach);
    const challenger = testEngine.getCardModel(liloGalacticHero);

    await testEngine.tapCard(iagoOutOfReach);

    // Check that Iago can be challenged
    expect(cardUnderTest.canBeChallenged(challenger)).toEqual(true);
    expect(challenger.canChallenge(cardUnderTest)).toEqual(true);

    await testEngine.tapCard(stitchRockStar);

    // Check that Iago can't be challenged
    expect(cardUnderTest.canBeChallenged(challenger)).toEqual(false);
    expect(challenger.canChallenge(cardUnderTest)).toEqual(false);
  });
});
