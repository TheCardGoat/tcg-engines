import { describe, expect, it } from "bun:test";
import { gastonBaritoneBully } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gaston - Baritone Bully", () => {
  it("Singer", () => {
    const testStore = new TestStore({
      inkwell: gastonBaritoneBully.cost,
      play: [gastonBaritoneBully],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      gastonBaritoneBully.id,
    );

    expect(cardUnderTest.hasSinger()).toEqual(true);
  });
});
