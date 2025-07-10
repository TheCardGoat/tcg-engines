/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloMakingAWish,
  magicBroomBucketBrigade,
  mickeyMouseWaywardSorcerer,
  simbaProtectiveCub,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mickey Mouse - Wayward Sorcerer", () => {
  describe("**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.", () => {
    it("should reduce the cost of Broom characters by 1", () => {
      const testStore = new TestStore({
        inkwell: magicBroomBucketBrigade.cost - 1,
        play: [mickeyMouseWaywardSorcerer],
        hand: [magicBroomBucketBrigade],
      });

      const target = testStore.getByZoneAndId(
        "hand",
        magicBroomBucketBrigade.id,
      );

      target.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(target.zone).toEqual("play");
    });

    it("Two Mickeys should reduce the cost of Broom characters by 2", () => {
      const testStore = new TestStore({
        inkwell: magicBroomBucketBrigade.cost - 2,
        play: [mickeyMouseWaywardSorcerer, mickeyMouseWaywardSorcerer],
        hand: [magicBroomBucketBrigade],
      });

      const target = testStore.getByZoneAndId(
        "hand",
        magicBroomBucketBrigade.id,
      );

      target.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(target.zone).toEqual("play");
    });
  });

  describe("**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.", () => {
    it("as attacker", () => {
      const testStore = new TestStore(
        {
          play: [mickeyMouseWaywardSorcerer, magicBroomBucketBrigade],
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      const defender = testStore.getByZoneAndId(
        "play",
        simbaProtectiveCub.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId(
        "play",
        magicBroomBucketBrigade.id,
      );

      defender.updateCardMeta({ exerted: true });

      attacker.challenge(defender);
      testStore.resolveOptionalAbility();
      expect(testStore.stackLayers).toHaveLength(0);
      expect(attacker.zone).toEqual("hand");
    });

    it("as defender", () => {
      const testStore = new TestStore(
        {
          play: [simbaProtectiveCub],
        },
        {
          play: [mickeyMouseWaywardSorcerer, magicBroomBucketBrigade],
        },
      );

      const attacker = testStore.getByZoneAndId("play", simbaProtectiveCub.id);
      const defender = testStore.getByZoneAndId(
        "play",
        magicBroomBucketBrigade.id,
        "player_two",
      );

      defender.updateCardMeta({ exerted: true });

      attacker.challenge(defender);
      testStore.changePlayer("player_two");
      testStore.resolveTopOfStack();

      expect(defender.zone).toEqual("hand");
    });

    it("opponent's brooms don't get affected by the ability", () => {
      const testStore = new TestStore(
        {
          play: [mickeyMouseWaywardSorcerer, simbaProtectiveCub],
        },
        {
          play: [magicBroomBucketBrigade],
        },
      );

      const attacker = testStore.getByZoneAndId("play", simbaProtectiveCub.id);
      const defender = testStore.getByZoneAndId(
        "play",
        magicBroomBucketBrigade.id,
        "player_two",
      );

      defender.updateCardMeta({ exerted: true });

      attacker.challenge(defender);

      expect(defender.zone).toEqual("discard");
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });

    it("non-brooms don't get affected by the skill", () => {
      const testStore = new TestStore(
        {
          play: [mickeyMouseWaywardSorcerer, liloMakingAWish],
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      const defender = testStore.getByZoneAndId(
        "play",
        simbaProtectiveCub.id,
        "player_two",
      );
      const attacker = testStore.getByZoneAndId("play", liloMakingAWish.id);

      defender.updateCardMeta({ exerted: true });

      attacker.challenge(defender);

      expect(attacker.zone).toEqual("discard");
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });
  });
});
