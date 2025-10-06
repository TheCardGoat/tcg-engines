/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  chipTheTeacupGentleSoul,
  heiheiPersistentPresence,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

export function heiheiPersistenetPresenceTestCases() {
  describe("**HE'S BACK!** When this character is banished in a challenge, return this card to your hand.", () => {
    it("should not return to hand when banished out of a challenge", () => {
      const testStore = new TestStore(
        {
          inkwell: dragonFire.cost,
          hand: [dragonFire],
        },
        {
          play: [heiheiPersistentPresence],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        heiheiPersistentPresence.id,
        "player_two",
      );
      const removal = testStore.getByZoneAndId("hand", dragonFire.id);

      removal.playFromHand();
      testStore.resolveTopOfStack({ targetId: cardUnderTest.instanceId });

      expect(cardUnderTest.zone).toEqual("discard");
    });

    it("as an attacker, should return to hand when banished", () => {
      const testStore = new TestStore(
        {
          play: [heiheiPersistentPresence],
        },
        {
          play: [chipTheTeacupGentleSoul],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        heiheiPersistentPresence.id,
      );
      const defender = testStore.getByZoneAndId(
        "play",
        chipTheTeacupGentleSoul.id,
        "player_two",
      );

      expect(cardUnderTest.zone).toEqual("play");
      expect(defender.zone).toEqual("play");

      defender.updateCardMeta({ exerted: true });
      cardUnderTest.challenge(defender);

      expect(cardUnderTest.zone).toEqual("hand");
      expect(defender.zone).toEqual("discard");
    });

    it("as a defender, should return to hand when banished", () => {
      const testStore = new TestStore(
        {
          play: [chipTheTeacupGentleSoul],
        },
        {
          play: [heiheiPersistentPresence],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        heiheiPersistentPresence.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId(
        "play",
        chipTheTeacupGentleSoul.id,
      );

      cardUnderTest.updateCardMeta({ exerted: true });

      attacker.challenge(cardUnderTest);
      testStore.resolveTopOfStack();

      expect(cardUnderTest.zone).toEqual("hand");
      expect(attacker.zone).toEqual("discard");
    });
  });
}

describe("'When this character is banished in a challenge' trigger", () => {
  heiheiPersistenetPresenceTestCases();
});
