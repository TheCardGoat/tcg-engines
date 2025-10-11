/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  donaldDuckMusketeer,
  goofyMusketeer,
  scarShamelessFirebrand,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Goofy - Musketeer", () => {
  describe("**When you play this character, you may remove up to 2 damage from each of your Musketeer characters**", () => {
    it("Healing 2 damage from one character", () => {
      const testStore = new TestStore({
        inkwell: goofyMusketeer.cost,
        hand: [goofyMusketeer],
        play: [donaldDuckMusketeer],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", goofyMusketeer.id);
      const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);

      target.updateCardMeta({ damage: 2 });

      cardUnderTest.playFromHand({ bodyguard: true });

      testStore.resolveTopOfStack();

      expect(cardUnderTest.zone).toEqual("play");
      expect(target.meta.damage).toEqual(0);
    });

    it("Healing 2 damage only to muskeeter characters", () => {
      const testStore = new TestStore({
        inkwell: goofyMusketeer.cost,
        hand: [goofyMusketeer],
        play: [donaldDuckMusketeer, scarShamelessFirebrand],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", goofyMusketeer.id);
      const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
      const shouldNotBeTarget = testStore.getByZoneAndId(
        "play",
        scarShamelessFirebrand.id,
      );

      target.updateCardMeta({ damage: 2 });
      shouldNotBeTarget.updateCardMeta({ damage: 2 });

      cardUnderTest.playFromHand({ bodyguard: true });

      testStore.resolveTopOfStack();

      expect(cardUnderTest.zone).toEqual("play");
      expect(target.meta.damage).toEqual(0);
      expect(shouldNotBeTarget.meta.damage).toEqual(2);
    });
  });
});
