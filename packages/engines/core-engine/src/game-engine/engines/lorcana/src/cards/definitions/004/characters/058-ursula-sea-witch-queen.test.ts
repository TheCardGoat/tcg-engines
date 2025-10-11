import { describe, expect, it } from "bun:test";
import { partOfYourWorld } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { cinderellaBallroomSensation } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  diabloMaleficentsSpy,
  ursulaSeaWitchQueen,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
        hand: [partOfYourWorld],
      });

      const songToSing = testStore.getCard(partOfYourWorld);
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
        hand: [partOfYourWorld],
      });

      const { singer, song } = await testEngine.singSong({
        song: partOfYourWorld,
        singer: cinderellaBallroomSensation,
      });

      expect(singer.ready).toEqual(false);
      expect(song.zone).toEqual("discard");
    });
  });
});
