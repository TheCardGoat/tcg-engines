import { describe, expect, it } from "bun:test";
import { happyGoodNatured } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Happy - Good-Natured", () => {
  it("Support", () => {
    const testStore = new TestStore({
      play: [happyGoodNatured],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", happyGoodNatured.id);

    expect(cardUnderTest.hasSupport()).toEqual(true);
  });
});
