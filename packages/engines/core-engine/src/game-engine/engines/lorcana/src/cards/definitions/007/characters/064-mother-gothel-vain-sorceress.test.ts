/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { goonsMaleficent } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { rapunzelGiftedArtist } from "../../002/characters/characters";
import { rapunzelsTowerSecludedPrison } from "../../005/locations/locations";
import { motherGothelVainSorceress } from "./064-mother-gothel-vain-sorceress";

describe("Mother Gothel - Vain Sorceress", () => {
  describe("NOW YOU'VE UPSET ME - When one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.", () => {
    it("should move 1 damage counter from chosen character to chosen opposing character when ability is accepted", () => {
      const testStore = new TestStore(
        {
          play: [motherGothelVainSorceress, rapunzelGiftedArtist],
        },
        {
          play: [goonsMaleficent],
        },
      );

      const gothel = testStore.getByZoneAndId(
        "play",
        motherGothelVainSorceress.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        goonsMaleficent.id,
        "player_two",
      );
      const rapunzel = testStore.getByZoneAndId(
        "play",
        rapunzelGiftedArtist.id,
      );

      // Set up initial state
      rapunzel.updateCardMeta({ damage: 2 });
      target.updateCardMeta({ exerted: true, damage: 0 });

      // Challenge to trigger the ability
      testStore.store.challenge(rapunzel.instanceId, target.instanceId);

      // Accept the optional ability
      testStore.resolveTopOfStack({}, true);

      // Choose source character (where to take damage from)
      testStore.resolveTopOfStack({ targets: [rapunzel] }, true);

      // Choose target character (where to move damage to)
      testStore.resolveTopOfStack({ targets: [target] }, true);

      // Verify the damage was moved correctly
      expect(rapunzel.meta.damage).toBe(1);
      expect(target.meta.damage).toBe(1);
    });

    it("should not move damage when ability is declined", () => {
      const testStore = new TestStore(
        {
          play: [motherGothelVainSorceress, rapunzelGiftedArtist],
        },
        {
          play: [goonsMaleficent],
        },
      );

      const gothel = testStore.getByZoneAndId(
        "play",
        motherGothelVainSorceress.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        goonsMaleficent.id,
        "player_two",
      );
      const rapunzel = testStore.getByZoneAndId(
        "play",
        rapunzelGiftedArtist.id,
      );

      // Set up initial state
      rapunzel.updateCardMeta({ damage: 2 });
      target.updateCardMeta({ exerted: true, damage: 0 });

      // Challenge to trigger the ability
      testStore.store.challenge(rapunzel.instanceId, target.instanceId);

      // Decline the optional ability
      testStore.resolveTopOfStack({ skip: true }, true);

      // Verify no damage was moved
      expect(rapunzel.meta.damage).toBe(2);
      expect(target.meta.damage).toBe(0);
    });

    it("should move 1 damage counter from chosen character to chosen opposing character when challenging a location", () => {
      const testStore = new TestStore(
        {
          play: [motherGothelVainSorceress, rapunzelGiftedArtist],
        },
        {
          play: [rapunzelsTowerSecludedPrison, goonsMaleficent],
        },
      );

      const gothel = testStore.getByZoneAndId(
        "play",
        motherGothelVainSorceress.id,
      );
      const tower = testStore.getByZoneAndId(
        "play",
        rapunzelsTowerSecludedPrison.id,
        "player_two",
      );
      const target = testStore.getByZoneAndId(
        "play",
        goonsMaleficent.id,
        "player_two",
      );
      const rapunzel = testStore.getByZoneAndId(
        "play",
        rapunzelGiftedArtist.id,
      );

      // Set up initial state
      rapunzel.updateCardMeta({ damage: 2 });
      tower.updateCardMeta({ damage: 0 });
      target.updateCardMeta({ exerted: true, damage: 0 });

      // Challenge to trigger the ability
      testStore.store.challenge(gothel.instanceId, tower.instanceId);

      // Accept the optional ability
      testStore.resolveTopOfStack({}, true);

      // Choose source character (where to take damage from)
      testStore.resolveTopOfStack({ targets: [rapunzel] }, true);

      // Choose target character (where to move damage to)
      testStore.resolveTopOfStack({ targets: [target] }, true);

      // Verify the damage was moved correctly
      expect(rapunzel.meta.damage).toBe(1);
      expect(target.meta.damage).toBe(1);
    });
  });

  describe("Regression", () => {
    it("moves damage before challenge is resolved", async () => {
      const testEngine = new TestEngine(
        {
          play: [motherGothelVainSorceress],
        },
        {
          play: [goonsMaleficent],
        },
      );

      await testEngine.tapCard(goonsMaleficent);
      await testEngine.setCardDamage(
        goonsMaleficent,
        goonsMaleficent.willpower - 1,
      );
      await testEngine.setCardDamage(
        motherGothelVainSorceress,
        motherGothelVainSorceress.willpower - 1,
      );

      await testEngine.challenge({
        attacker: motherGothelVainSorceress,
        defender: goonsMaleficent,
      });

      await testEngine.acceptOptionalLayer();
      await testEngine.resolveTopOfStack(
        {
          targets: [motherGothelVainSorceress],
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        targets: [goonsMaleficent],
      });

      expect(testEngine.getCardModel(motherGothelVainSorceress).zone).toBe(
        "play",
      );
      expect(testEngine.getCardModel(motherGothelVainSorceress).damage).toBe(
        motherGothelVainSorceress.willpower - 2, // She moved 1 damage to Maleficent
      );
      expect(testEngine.getCardModel(goonsMaleficent).zone).toBe("discard");
    });
  });
});
