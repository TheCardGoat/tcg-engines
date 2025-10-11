/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  kuzcoTemperamentalEmperor,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kuzco - Temperamental Emperor", () => {
  describe("NO TOUCHY!** When this character is challenged and banished, you may banish the challenging character.", () => {
    it.skip("should banish the challenging character", () => {
      const testStore = new TestStore(
        {
          play: [teKaTheBurningOne],
        },
        {
          play: [kuzcoTemperamentalEmperor],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        kuzcoTemperamentalEmperor.id,
        "player_two",
      );

      const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);

      expect(cardUnderTest.zone).toEqual("play");
      cardUnderTest.updateCardMeta({ exerted: true });

      attacker.challenge(cardUnderTest);
      testStore.resolveTopOfStack();

      expect(testStore.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({ discard: 1, play: 0 }),
      );
      expect(testStore.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({ discard: 1, play: 0 }),
      );
    });

    it.skip("skips banish effect", () => {
      const testStore = new TestStore(
        {
          play: [teKaTheBurningOne],
        },
        {
          play: [kuzcoTemperamentalEmperor],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        kuzcoTemperamentalEmperor.id,
        "player_two",
      );

      const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);

      expect(cardUnderTest.zone).toEqual("play");
      cardUnderTest.updateCardMeta({ exerted: true });

      attacker.challenge(cardUnderTest);
      testStore.resolveTopOfStack();

      expect(testStore.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({ discard: 0, play: 1 }),
      );
      expect(testStore.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({ discard: 1, play: 0 }),
      );
    });
  });
});
