/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielOnHumanLegs } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { partOfOurWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Voiceless keywords", () => {
  it("Does NOT sing if character has voiceless", () => {
    const testStore = new TestStore({
      play: [arielOnHumanLegs],
      hand: [partOfOurWorld],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", arielOnHumanLegs.id);
    const songToSing = testStore.getByZoneAndId("hand", partOfOurWorld.id);

    expect(cardUnderTest.ready).toEqual(true);
    expect(cardUnderTest.meta.playedThisTurn).toBeFalsy();

    cardUnderTest.sing(songToSing);

    expect(cardUnderTest.ready).toEqual(true);
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        play: 1,
      }),
    );
  });
});
