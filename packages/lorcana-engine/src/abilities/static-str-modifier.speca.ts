/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  grumpyBadTempered,
  happyGoodNatured,
  sleepyNoddingOff,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("[Grumpy - Bad-Tempered] Both players see the bonus the same way.", () => {
  it("As active player", () => {
    const testStore = new TestStore({
      inkwell: grumpyBadTempered.cost,
      play: [grumpyBadTempered, sleepyNoddingOff, happyGoodNatured],
    });

    const happy = testStore.getByZoneAndId("play", happyGoodNatured.id);

    expect(happy.strength).toEqual(happyGoodNatured.strength + 1);
  });

  it("As an opponent", () => {
    const testStore = new TestStore(
      {},
      {
        inkwell: grumpyBadTempered.cost,
        play: [grumpyBadTempered, sleepyNoddingOff, happyGoodNatured],
      },
    );

    const happy = testStore.getByZoneAndId(
      "play",
      happyGoodNatured.id,
      "player_two",
    );

    expect(happy.strength).toEqual(happyGoodNatured.strength + 1);
  });
});
