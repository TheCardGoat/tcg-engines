/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielOnHumanLegs,
  cinderellaGentleAndKind,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Cinderella - Gentle And Kind", () => {
  describe("{E}− Remove up to 3 damage from chosen Princess character.", () => {
    it("Healing 3 damage from princess character", () => {
      const testStore = new TestStore({
        play: [cinderellaGentleAndKind, arielOnHumanLegs],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        cinderellaGentleAndKind.id,
      );
      const target = testStore.getByZoneAndId("play", arielOnHumanLegs.id);

      target.updateCardMeta({ damage: 4 });

      cardUnderTest.activate();

      testStore.resolveTopOfStack({ targetId: target.instanceId });

      expect(target.meta.damage).toEqual(1);
    });
  });
});
