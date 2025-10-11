/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { heiheiBoatSnack } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { shieldOfVirtue } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Shield of Virtue", () => {
  it("Fireproof - Ready chosen character. They can't quest for the rest of this turn.", () => {
    const testStore = new TestStore({
      inkwell: 3,
      play: [shieldOfVirtue, heiheiBoatSnack],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", shieldOfVirtue.id);
    const target = testStore.getByZoneAndId("play", heiheiBoatSnack.id);

    target.updateCardMeta({ exerted: true });

    cardUnderTest.activate();

    expect(target.meta.exerted).toBeTruthy();
    testStore.resolveTopOfStack({ targetId: target.instanceId });
    expect(target.meta.exerted).toBeFalsy();

    target.quest();

    expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
  });
});
