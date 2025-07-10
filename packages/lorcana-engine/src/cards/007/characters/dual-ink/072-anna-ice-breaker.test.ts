/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  annaIceBreaker,
  doloresMadrigalWithinEarshot,
  donaldDuckFlusteredSorcerer,
  theQueenJealousBeauty,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Anna - Ice Breaker", () => {
  it("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [annaIceBreaker],
    });

    const cardUnderTest = testEngine.getCardModel(annaIceBreaker);
    expect(cardUnderTest.hasSupport).toBe(true);
  });

  it("WINTER AMBUSH When you play this character, chosen opposing character can’t ready at the start of their next turn.", async () => {
    const play = [
      donaldDuckFlusteredSorcerer,
      theQueenJealousBeauty,
      doloresMadrigalWithinEarshot,
    ];
    const testEngine = new TestEngine(
      {
        inkwell: annaIceBreaker.cost,
        hand: [annaIceBreaker],
        deck: 5,
      },
      {
        play: play,
        deck: 5,
      },
    );

    for (const card of play) {
      await testEngine.tapCard(card);
    }

    await testEngine.playCard(annaIceBreaker, {
      targets: [doloresMadrigalWithinEarshot],
    });

    await testEngine.passTurn();

    expect(testEngine.getCardModel(doloresMadrigalWithinEarshot).exerted).toBe(
      true,
    );
  });
});
