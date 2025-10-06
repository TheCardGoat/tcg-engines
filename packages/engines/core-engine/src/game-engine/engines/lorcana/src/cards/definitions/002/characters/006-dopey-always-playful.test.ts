/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { smash } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  docLeaderOfTheSevenDwarfs,
  dopeyAlwaysPlayful,
  sleepyNoddingOff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dopey - Always Playful", () => {
  it("**ODD ONE OUT** When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: smash.cost,
        hand: [smash],
        deck: 1,
        play: [
          dopeyAlwaysPlayful,
          sleepyNoddingOff,
          docLeaderOfTheSevenDwarfs,
          liloMakingAWish,
        ],
      },
      { deck: 1 },
    );

    await testEngine.playCard(smash);
    await testEngine.resolveTopOfStack({
      targets: [dopeyAlwaysPlayful],
    });
    expect(testEngine.getCardModel(dopeyAlwaysPlayful).zone).toEqual("discard");

    expect(testEngine.getCardModel(liloMakingAWish).strength).toEqual(
      liloMakingAWish.strength,
    );
    const dwarves = [
      testEngine.getCardModel(docLeaderOfTheSevenDwarfs),
      testEngine.getCardModel(sleepyNoddingOff),
    ];

    dwarves.forEach((card) => {
      expect(card.strength).toEqual((card.lorcanitoCard.strength || 0) + 2);
    });

    await testEngine.passTurn("player_one");

    dwarves.forEach((card) => {
      expect(card.strength).toEqual((card.lorcanitoCard.strength || 0) + 2);
    });

    await testEngine.passTurn("player_two");

    dwarves.forEach((card) => {
      expect(card.strength).toEqual(card.lorcanitoCard.strength);
    });
  });
});
