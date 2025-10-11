import { describe, expect, it } from "bun:test";
import { chernabogsFollowersCreaturesOfEvil } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Chernabog's Followers - Creatures of Evil", () => {
  describe("**RESTLESS SOULS** Whenever this character quests, you may banish this character to draw a card.", () => {
    it("should banish this character to draw a card", () => {
      const testStore = new TestStore({
        inkwell: chernabogsFollowersCreaturesOfEvil.cost,
        play: [chernabogsFollowersCreaturesOfEvil],
        deck: 1,
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        chernabogsFollowersCreaturesOfEvil.id,
      );

      cardUnderTest.quest();

      testStore.resolveOptionalAbility();
      expect(cardUnderTest.zone).toEqual("discard");
      expect(testStore.getZonesCardCount().hand).toEqual(1);
    });

    it("should not banish this character and not draw", () => {
      const testStore = new TestStore({
        inkwell: chernabogsFollowersCreaturesOfEvil.cost,
        play: [chernabogsFollowersCreaturesOfEvil],
        deck: 1,
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        chernabogsFollowersCreaturesOfEvil.id,
      );

      cardUnderTest.quest();

      testStore.skipOptionalAbility();
      expect(cardUnderTest.zone).toEqual("play");
      expect(testStore.getZonesCardCount().hand).toEqual(0);
      expect(testStore.getZonesCardCount().deck).toEqual(1);
    });
  });
});
