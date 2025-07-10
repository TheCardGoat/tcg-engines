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

describe("Grumpy - Bad-Tempered", () => {
  it("**THERE'S TROUBLE A-BREWIN'** Your other Seven Dwarfs characters get +1 {S}.", () => {
    const testStore = new TestStore(
      {
        inkwell: grumpyBadTempered.cost,
        play: [grumpyBadTempered, sleepyNoddingOff, happyGoodNatured],
      },
      { deck: 1 },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      grumpyBadTempered.id,
    );
    const sleepy = testStore.getByZoneAndId("play", sleepyNoddingOff.id);
    const happy = testStore.getByZoneAndId("play", happyGoodNatured.id);

    expect(cardUnderTest.strength).toEqual(grumpyBadTempered.strength);
    expect(sleepy.strength).toEqual(sleepyNoddingOff.strength + 1);
    expect(happy.strength).toEqual(happyGoodNatured.strength + 1);

    testStore.passTurn();

    expect(cardUnderTest.strength).toEqual(grumpyBadTempered.strength);
    expect(sleepy.strength).toEqual(sleepyNoddingOff.strength + 1);
    expect(happy.strength).toEqual(happyGoodNatured.strength + 1);
  });
});
