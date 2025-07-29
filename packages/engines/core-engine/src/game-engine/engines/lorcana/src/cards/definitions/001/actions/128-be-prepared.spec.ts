import { describe, expect, it } from "bun:test";
import {
  chiefTui,
  heiheiBoatSnack,
  mickeyMouseArtfulRogue,
  mickeyMouseTrueFriend,
  moanaOfMotunui,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  bePrepared,
  letItGo,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Be Prepared", () => {
  it("Board wipe", () => {
    const testStore = new TestStore(
      {
        inkwell: bePrepared.cost,
        hand: [bePrepared],
        play: [chiefTui, moanaOfMotunui, heiheiBoatSnack],
      },
      {
        play: [mickeyMouseTrueFriend, mickeyMouseArtfulRogue],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", bePrepared.id);

    cardUnderTest.playFromHand();

    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ play: 0 }),
    );
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ play: 0 }),
    );
  });
});
