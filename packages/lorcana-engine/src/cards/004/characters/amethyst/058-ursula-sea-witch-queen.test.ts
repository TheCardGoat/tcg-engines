/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { partOfOurWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  diabloMaleficentsSpy,
  ursulaSeaWitchQueen,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Ursula - Sea Witch Queen", () => {
  it("**NOW I'M THE RULER** Whenever this character quests, exert chosen character.", () => {
    const testStore = new TestStore({
      play: [ursulaSeaWitchQueen, diabloMaleficentsSpy],
    });

    const cardUnderTest = testStore.getCard(ursulaSeaWitchQueen);
    const target = testStore.getCard(diabloMaleficentsSpy);

    expect(target.meta.exerted).toBeFalsy();
    cardUnderTest.quest();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.meta.exerted).toBe(true);
  });

  describe("**YOU'LL LISTEN TO ME!**", () => {
    it("Other characters can't exert to sing songs.", () => {
      const testStore = new TestStore({
        play: [ursulaSeaWitchQueen, cinderellaBallroomSensation],
        hand: [partOfOurWorld],
      });

      const songToSing = testStore.getCard(partOfOurWorld);
      const cardToSing = testStore.getCard(cinderellaBallroomSensation);

      expect(cardToSing.ready).toEqual(true);
      expect(cardToSing.meta.playedThisTurn).toBeFalsy();

      cardToSing.sing(songToSing);

      expect(cardToSing.ready).toEqual(true);
      expect(testStore.getZonesCardCount().hand).toEqual(1);
      expect(testStore.getZonesCardCount().play).toEqual(2);
    });

    it("She's able to sing", async () => {
      const testEngine = new TestEngine({
        play: [ursulaSeaWitchQueen],
        discard: [cinderellaBallroomSensation],
        hand: [partOfOurWorld],
      });

      const { singer, song } = await testEngine.singSong({
        song: partOfOurWorld,
        singer: cinderellaBallroomSensation,
      });

      expect(singer.ready).toEqual(false);
      expect(song.zone).toEqual("discard");
    });
  });
});
