/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloGalacticHero,
  stitchRockStar,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { iagoOutOfReach } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
