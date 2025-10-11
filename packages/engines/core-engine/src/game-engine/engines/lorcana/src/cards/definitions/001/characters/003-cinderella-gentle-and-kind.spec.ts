/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  arielOnHumanLegs,
  cinderellaGentleAndKind,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
