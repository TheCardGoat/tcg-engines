/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  frecklesGoodBoy,
  gaetanMoliereTheMole,
  pepperQuickthinkingPuppy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pepper - Quick-Thinking Puppy", () => {
  it("IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine(
      {
        deck: 3,
        hand: [liloGalacticHero],
        play: [gaetanMoliereTheMole],
      },
      {
        play: [pepperQuickthinkingPuppy, frecklesGoodBoy],
      },
    );

    await testEngine.challenge({
      attacker: gaetanMoliereTheMole,
      defender: frecklesGoodBoy,
      exertDefender: true,
    });

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveOptionalAbility();

    expect(testEngine.getCardModel(frecklesGoodBoy).zone).toEqual("inkwell");
    expect(testEngine.getCardModel(pepperQuickthinkingPuppy).zone).toEqual(
      "play",
    );
    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 3,
        hand: 1,
        play: 1,
      }),
    );
  });
  it("Pepper to the inkwell", async () => {
    const testEngine = new TestEngine(
      {
        deck: 3,
        hand: [liloGalacticHero],
        play: [gaetanMoliereTheMole],
      },
      {
        play: [pepperQuickthinkingPuppy, frecklesGoodBoy],
      },
    );

    await testEngine.challenge({
      attacker: gaetanMoliereTheMole,
      defender: pepperQuickthinkingPuppy,
      exertDefender: true,
    });

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveOptionalAbility();

    expect(testEngine.getCardModel(pepperQuickthinkingPuppy).zone).toEqual(
      "inkwell",
    );
    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 3,
        hand: 1,
        play: 1,
      }),
    );
  });
});
