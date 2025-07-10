import { describe, expect, it } from "@jest/globals";
import {
  herculesUnwaveringDemigod,
  montereyJackGoodheartedRanger,
} from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Hercules - Unwavering Demigod", () => {
  it("Challenger +2 (While challenging, this character gets +2 {S}.)", async () => {
    const testEngine = new TestEngine(
      {
        play: [herculesUnwaveringDemigod],
      },
      { play: [montereyJackGoodheartedRanger] },
    );

    const cardUnderTest = testEngine.getCardModel(herculesUnwaveringDemigod);
    expect(cardUnderTest.hasChallenger).toBe(true);

    const cardToBeChallenged = testEngine.getCardModel(
      montereyJackGoodheartedRanger,
    );
    cardToBeChallenged.meta.exerted = true;

    cardUnderTest.challenge(cardToBeChallenged);
    expect(cardToBeChallenged.damage).toBe(4);
  });
});
