/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloMakingAWish,
  stichtCarefreeSurfer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { princeJohnGreediestOfAll } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { cursedMerfolkUrsulasHandiwork } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cursed Merfolk - Ursula's Handiwork", () => {
  it("**POOR SOULS** Whenever this character is challenged, each opponent chooses and discards a card.", async () => {
    const testEngine = new TestEngine(
      {
        play: [liloMakingAWish],
        hand: [stichtCarefreeSurfer],
        deck: 1,
      },
      {
        play: [cursedMerfolkUrsulasHandiwork],
        deck: 1,
      },
    );

    await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);

    await testEngine.challenge({
      attacker: liloMakingAWish,
      defender: cursedMerfolkUrsulasHandiwork,
    });

    expect(testEngine.stackLayers).toHaveLength(1);
    await testEngine.resolveTopOfStack({ targets: [stichtCarefreeSurfer] });

    expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
    expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
      "discard",
    );
  });
});

describe("Regression - Prince John Interaction, Cursed Merfolk is not getting banished", () => {
  it("Not having card to discard", async () => {
    const testEngine = new TestEngine(
      {
        play: [liloMakingAWish],
        deck: 1,
      },
      {
        play: [cursedMerfolkUrsulasHandiwork, princeJohnGreediestOfAll],
        deck: 2,
      },
    );

    await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);

    await testEngine.challenge({
      attacker: liloMakingAWish,
      defender: cursedMerfolkUrsulasHandiwork,
    });

    expect(testEngine.stackLayers).toHaveLength(0);

    expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
      "discard",
    );
  });

  it("Accepting the draw", async () => {
    const testEngine = new TestEngine(
      {
        play: [liloMakingAWish],
        hand: [stichtCarefreeSurfer],
        deck: 1,
      },
      {
        play: [cursedMerfolkUrsulasHandiwork, princeJohnGreediestOfAll],
        deck: 2,
      },
    );

    await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);

    await testEngine.challenge({
      attacker: liloMakingAWish,
      defender: cursedMerfolkUrsulasHandiwork,
    });

    expect(testEngine.stackLayers).toHaveLength(1);
    await testEngine.resolveTopOfStack(
      { targets: [stichtCarefreeSurfer] },
      true,
    );

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveOptionalAbility();

    expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
    expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
      "discard",
    );
  });

  it("Skipping the draw", async () => {
    const testEngine = new TestEngine(
      {
        play: [liloMakingAWish],
        hand: [stichtCarefreeSurfer],
        deck: 1,
      },
      {
        play: [cursedMerfolkUrsulasHandiwork, princeJohnGreediestOfAll],
        deck: 2,
      },
    );

    await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);

    await testEngine.challenge({
      attacker: liloMakingAWish,
      defender: cursedMerfolkUrsulasHandiwork,
    });

    expect(testEngine.stackLayers).toHaveLength(1);
    await testEngine.resolveTopOfStack(
      { targets: [stichtCarefreeSurfer] },
      true,
    );

    testEngine.changeActivePlayer("player_two");
    await testEngine.skipTopOfStack();

    expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
    expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
      "discard",
    );
  });
});
