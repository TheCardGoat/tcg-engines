/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  donaldDuckMusketeer,
  timonGrubRustler,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Timon - Grub Rustler", () => {
  describe("When you play this \rcharacter, you may remove up to 1 damage from \rchosen character.", () => {
    it("Healing 1 damage from character", () => {
      const testStore = new TestStore({
        inkwell: timonGrubRustler.cost,
        hand: [timonGrubRustler],
        play: [donaldDuckMusketeer],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        timonGrubRustler.id,
      );
      const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);

      target.updateCardMeta({ damage: 2 });

      cardUnderTest.playFromHand();

      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targetId: target.instanceId });

      expect(cardUnderTest.zone).toEqual("play");
      expect(target.meta.damage).toEqual(1);
    });
  });
});
