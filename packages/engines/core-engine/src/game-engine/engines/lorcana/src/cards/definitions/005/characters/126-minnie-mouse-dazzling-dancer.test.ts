/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrueFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { minnieMouseDazzlingDancer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import { montereyJackGoodheartedRanger } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Minnie Mouse - Dazzling Dancer", () => {
  it("**DANCE-OFF** Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.", () => {
    const testEngine = new TestEngine(
      {
        play: [minnieMouseDazzlingDancer, mickeyMouseTrueFriend],
      },
      {
        play: [montereyJackGoodheartedRanger],
      },
    );

    const cardUnderTest = testEngine.getCardModel(minnieMouseDazzlingDancer);
    const mickeyCard = testEngine.getCardModel(mickeyMouseTrueFriend);
    const target = testEngine.getCardModel(montereyJackGoodheartedRanger);

    target.exert();

    testEngine.challenge({
      attacker: cardUnderTest,
      defender: target,
    });

    expect(testEngine.getLoreForPlayer("player_one")).toBe(1);

    testEngine.challenge({
      attacker: mickeyCard,
      defender: target,
    });

    expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
  });
});
