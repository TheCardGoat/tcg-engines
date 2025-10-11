import { describe, expect, it } from "bun:test";
import { grabYourSword } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import {
  christopherRobinAdventurer,
  cinderellaStouthearted,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cinderella- Stouthearted", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      play: [cinderellaStouthearted],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cinderellaStouthearted.id,
    );

    expect(cardUnderTest.hasShift()).toBeTruthy();
  });

  it("Resist", () => {
    const testStore = new TestStore({
      play: [cinderellaStouthearted],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cinderellaStouthearted.id,
    );

    expect(cardUnderTest.hasResist).toBeTruthy();
  });

  it("**THE SINGING SWORD** Whenever you play a song, this character may challenge ready characters this turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: grabYourSword.cost,
        hand: [grabYourSword],
        play: [cinderellaStouthearted],
      },
      { play: [christopherRobinAdventurer] },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cinderellaStouthearted.id,
    );
    const defender = testStore.getByZoneAndId(
      "play",
      christopherRobinAdventurer.id,
      "player_two",
    );
    const song = testStore.getByZoneAndId("hand", grabYourSword.id);

    expect(cardUnderTest.canChallenge(defender)).toBeFalsy();

    song.playFromHand();

    expect(cardUnderTest.canChallenge(defender)).toBeTruthy();
  });
});
