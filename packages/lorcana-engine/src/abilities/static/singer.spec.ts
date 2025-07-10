/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { sebastianCourtComposer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Singer keywords", () => {
  it("sings a song cheaper", () => {
    const testStore = new TestStore({
      deck: [TestStore.aCard, TestStore.aCard],
      play: [sebastianCourtComposer],
      hand: [friendsOnTheOtherSide],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      sebastianCourtComposer.id,
    );
    const songToSing = testStore.getByZoneAndId(
      "hand",
      friendsOnTheOtherSide.id,
    );

    cardUnderTest.sing(songToSing);

    expect(cardUnderTest.ready).toEqual(false);
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 2,
        discard: 1,
        deck: 0,
      }),
    );
  });

  it("Does NOT sing if the ink is fresh", () => {
    const testStore = new TestStore({
      deck: 2,
      inkwell: sebastianCourtComposer.cost,
      hand: [friendsOnTheOtherSide, sebastianCourtComposer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      sebastianCourtComposer.id,
    );
    const songToSing = testStore.getByZoneAndId(
      "hand",
      friendsOnTheOtherSide.id,
    );

    testStore.store.playCardFromHand(cardUnderTest.instanceId);

    expect(cardUnderTest.ready).toEqual(true);
    expect(cardUnderTest.meta.playedThisTurn).toEqual(true);

    cardUnderTest.sing(songToSing);

    expect(cardUnderTest.ready).toEqual(true);
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        play: 1,
      }),
    );
  });

  it("Can't sing exerted", () => {
    const testStore = new TestStore({
      play: [sebastianCourtComposer],
      hand: [friendsOnTheOtherSide],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      sebastianCourtComposer.id,
    );
    const songToSing = testStore.getByZoneAndId(
      "hand",
      friendsOnTheOtherSide.id,
    );

    cardUnderTest.updateCardMeta({ exerted: true });
    expect(cardUnderTest.ready).toEqual(false);

    cardUnderTest.sing(songToSing);

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        discard: 0,
        play: 1,
      }),
    );
  });
});
