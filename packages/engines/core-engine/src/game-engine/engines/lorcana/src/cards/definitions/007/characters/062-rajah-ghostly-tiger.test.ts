/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { grabYourSword } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { rajahGhostlyTiger } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Vanish (When an opponent chooses this character for an action, banish them.)", () => {
  it("should be banished when is targeted by an action", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 10,
        hand: [letTheStormRageOn],
      },
      {
        play: [rajahGhostlyTiger],
      },
    );

    //await testEngine.playCard(letTheStormRageOn);

    const cardTarget = testEngine.getCardModel(rajahGhostlyTiger);

    await testEngine.playCard(letTheStormRageOn, {
      targets: [rajahGhostlyTiger],
    });
    expect(testEngine.stackLayers).toHaveLength(0);

    expect(cardTarget.isDead).toBe(true);
  });

  it("should NOT be banished when is targeted by an action from themselves", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      hand: [letTheStormRageOn],
      play: [rajahGhostlyTiger],
    });

    const cardTarget = testEngine.getCardModel(rajahGhostlyTiger);

    await testEngine.playCard(letTheStormRageOn, {
      targets: [rajahGhostlyTiger],
    });
    expect(testEngine.stackLayers).toHaveLength(0);

    expect(cardTarget.isDead).toBe(false);
  });

  it("should not be banished when is play an area action and damage is not greater or equal as its willpower", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 10,
        hand: [grabYourSword],
      },
      {
        play: [rajahGhostlyTiger],
      },
    );

    const cardTarget = testEngine.getCardModel(rajahGhostlyTiger);

    await testEngine.playCard(grabYourSword);
    expect(testEngine.stackLayers).toHaveLength(0);

    expect(cardTarget.isDead).toBe(false);
  });
});
