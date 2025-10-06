/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { friendsOnTheOtherSide } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { breakFree } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import {
  daisyDuckSpotlessFoodfighter,
  denahiAvengingBrother,
  petePastryChomper,
  robinHoodSharpshooter,
  simbaAdventurousSuccessor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Robin Hood - Sharpshooter", () => {
  it("**MY GREATEST PERFORMANCE** Additional test with friends on the other side", async () => {
    const testEngine = new TestEngine(
      {
        play: [robinHoodSharpshooter],
        deck: [
          liloGalacticHero,
          simbaAdventurousSuccessor,
          breakFree,
          petePastryChomper,
          denahiAvengingBrother,
          daisyDuckSpotlessFoodfighter,
          friendsOnTheOtherSide,
        ],
      },
      { deck: 60 },
    );

    const target = testEngine.getCardModel(friendsOnTheOtherSide);
    const otherCards = [
      testEngine.getCardModel(petePastryChomper),
      testEngine.getCardModel(denahiAvengingBrother),
      testEngine.getCardModel(daisyDuckSpotlessFoodfighter),
    ];

    await testEngine.questCard(robinHoodSharpshooter);
    await testEngine.resolveTopOfStack(
      {
        scry: {
          discard: otherCards,
          play: [target],
        },
      },
      true,
    );

    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 0, deck: 60, discard: 0 }),
    );
    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 2, deck: 1, discard: 4 }),
    );
  });
});
