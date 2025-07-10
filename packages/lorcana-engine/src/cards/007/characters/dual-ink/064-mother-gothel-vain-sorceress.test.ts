/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { rapunzelGiftedArtist } from "../../../002/characters/characters";
import { rapunzelsTowerSecludedPrison } from "../../../005/locations/locations";
import { motherGothelVainSorceress } from "../motherGothelVainSorceress";

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
});
