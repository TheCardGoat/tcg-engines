/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  dragonFire,
  fireTheCannons,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  beastRelentless,
  donaldDuckPerfectGentleman,
  goofyKnightForADay,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Beast - Relentless", () => {
  describe("**SECOND WIND** Whenever an opposing character is damaged, you may ready this character.", () => {
    it("Beast himself challenging other", () => {
      const testStore = new TestStore(
        {
          inkwell: beastRelentless.cost,
          play: [beastRelentless],
        },
        {
          play: [donaldDuckPerfectGentleman],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        beastRelentless.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        donaldDuckPerfectGentleman.id,
        "player_two",
      );

      target.updateCardMeta({ exerted: true });
      cardUnderTest.challenge(target);

      testStore.resolveOptionalAbility();

      expect(cardUnderTest.ready).toBe(true);
    });

    it("Damaged in combat", () => {
      const testStore = new TestStore(
        {
          inkwell: beastRelentless.cost,
          play: [beastRelentless, goofyKnightForADay],
        },
        {
          play: [donaldDuckPerfectGentleman],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        beastRelentless.id,
      );
      const attacker = testStore.getByZoneAndId("play", goofyKnightForADay.id);
      const defender = testStore.getByZoneAndId(
        "play",
        donaldDuckPerfectGentleman.id,
        "player_two",
      );

      cardUnderTest.updateCardMeta({ exerted: true });
      defender.updateCardMeta({ exerted: true });

      attacker.challenge(defender);

      testStore.resolveOptionalAbility();

      expect(cardUnderTest.ready).toBe(true);
    });

    it("Damaged by action", () => {
      const testStore = new TestStore(
        {
          inkwell: fireTheCannons.cost,
          play: [beastRelentless],
          hand: [fireTheCannons],
        },
        {
          play: [donaldDuckPerfectGentleman],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        beastRelentless.id,
      );
      const action = testStore.getByZoneAndId("hand", fireTheCannons.id);
      const target = testStore.getByZoneAndId(
        "play",
        donaldDuckPerfectGentleman.id,
        "player_two",
      );

      cardUnderTest.updateCardMeta({ exerted: true });

      action.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] }, true);

      testStore.resolveOptionalAbility();

      expect(cardUnderTest.ready).toBe(true);
    });

    it("Self character being damaged", () => {
      const testStore = new TestStore({
        inkwell: fireTheCannons.cost,
        play: [beastRelentless, donaldDuckPerfectGentleman],
        hand: [fireTheCannons],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        beastRelentless.id,
      );
      const action = testStore.getByZoneAndId("hand", fireTheCannons.id);
      const target = testStore.getByZoneAndId(
        "play",
        donaldDuckPerfectGentleman.id,
      );

      cardUnderTest.updateCardMeta({ exerted: true });

      action.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(cardUnderTest.ready).toBe(false);
    });

    it("Opposing character being banished", () => {
      const testStore = new TestStore(
        {
          inkwell: dragonFire.cost,
          play: [beastRelentless],
          hand: [dragonFire],
        },
        {
          play: [donaldDuckPerfectGentleman],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        beastRelentless.id,
      );
      const action = testStore.getByZoneAndId("hand", dragonFire.id);
      const target = testStore.getByZoneAndId(
        "play",
        donaldDuckPerfectGentleman.id,
        "player_two",
      );

      cardUnderTest.updateCardMeta({ exerted: true });

      action.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(cardUnderTest.ready).toBe(false);
    });

    it("Beast vs Beast", async () => {
      const testStore = new TestEngine(
        {
          play: [beastRelentless],
        },
        {
          play: [beastRelentless],
        },
      );

      const attacker = testStore.getByZoneAndId("play", beastRelentless.id);
      const defender = testStore.getByZoneAndId(
        "play",
        beastRelentless.id,
        "player_two",
      );

      await testStore.challenge({
        attacker,
        defender,
        exertDefender: true,
      });

      testStore.changeActivePlayer("player_one");
      await testStore.acceptOptionalLayer(
        false,
        testStore.getLayerIdForPlayer("player_one"),
      );
      testStore.changeActivePlayer("player_two");
      await testStore.acceptOptionalLayer(
        false,
        testStore.getLayerIdForPlayer("player_two"),
      );

      expect(attacker.ready).toBe(true);
      expect(defender.ready).toBe(true);
      expect(testStore.stackLayers).toHaveLength(0);
    });
  });
});
