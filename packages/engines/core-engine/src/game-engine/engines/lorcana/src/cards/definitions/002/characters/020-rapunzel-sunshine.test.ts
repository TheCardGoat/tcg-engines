/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  rapunzelSunshine,
  snowWhiteWellWisher,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Rapunzel - Sunshine", () => {
  describe("**MAGIC HAIR** {E} − Remove up to 2 damage from chosen character.", () => {
    it("remove 2 damage", () => {
      const testStore = new TestStore({
        inkwell: rapunzelSunshine.cost,

        play: [rapunzelSunshine, snowWhiteWellWisher],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        rapunzelSunshine.id,
      );
      const damagedChar = testStore.getByZoneAndId(
        "play",
        snowWhiteWellWisher.id,
      );
      damagedChar.updateCardDamage(2);
      expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 2 }));

      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
      cardUnderTest.activate();
      expect(testStore.store.stackLayerStore.layers).toHaveLength(1);

      const effect = testStore.store.stackLayerStore.layers[0];
      if (effect) {
        testStore.resolveTopOfStack({
          targets: [damagedChar],
        });
      }
      expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 0 }));
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });

    it("remove 1 damage", () => {
      const testStore = new TestStore({
        inkwell: rapunzelSunshine.cost,

        play: [rapunzelSunshine, snowWhiteWellWisher],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        rapunzelSunshine.id,
      );
      const damagedChar = testStore.getByZoneAndId(
        "play",
        snowWhiteWellWisher.id,
      );
      damagedChar.updateCardDamage(1);
      expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 1 }));

      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
      cardUnderTest.activate();
      expect(testStore.store.stackLayerStore.layers).toHaveLength(1);

      const effect = testStore.store.stackLayerStore.layers[0];
      if (effect) {
        testStore.resolveTopOfStack({
          targets: [damagedChar],
        });
      }
      expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 0 }));
      expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
    });
  });
});
