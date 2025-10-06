/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  marshmallowPersistentGuardian,
  mauiDemiGod,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Marshmallow - Persistent Guardian", () => {
  describe("**DURABLE** When this character is banished in a challenge, you may return this card to your hand.", () => {
    it("should not return to hand when banished out of a challenge", () => {
      const testStore = new TestStore(
        {
          inkwell: dragonFire.cost,
          hand: [dragonFire],
        },
        {
          play: [marshmallowPersistentGuardian],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        marshmallowPersistentGuardian.id,
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
          play: [marshmallowPersistentGuardian],
        },
        {
          play: [mauiDemiGod],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        marshmallowPersistentGuardian.id,
      );
      const defender = testStore.getByZoneAndId(
        "play",
        mauiDemiGod.id,
        "player_two",
      );

      defender.updateCardMeta({ exerted: true });
      cardUnderTest.challenge(defender);
      testStore.resolveTopOfStack();

      expect(cardUnderTest.zone).toEqual("hand");
      expect(defender.meta.damage).toEqual(
        cardUnderTest.lorcanitoCard.strength,
      );
    });

    it("as a defender, should return to hand when banished", () => {
      const testStore = new TestStore(
        {
          play: [mauiDemiGod],
        },
        {
          play: [marshmallowPersistentGuardian],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        marshmallowPersistentGuardian.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId("play", mauiDemiGod.id);

      cardUnderTest.updateCardMeta({ exerted: true });

      attacker.challenge(cardUnderTest);
      testStore.changePlayer("player_two");
      testStore.resolveTopOfStack();

      expect(cardUnderTest.zone).toEqual("hand");
      expect(attacker.meta.damage).toEqual(
        cardUnderTest.lorcanitoCard.strength,
      );
    });
  });
});
