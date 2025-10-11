import { describe, expect, it } from "bun:test";
import { kitCloudkickerSpunkyBearCub } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kit Cloudkicker - Spunky Bear Cub", () => {
  it.skip("**Ward** (Opponents can't choose this character except to challenge.)", () => {
    const testStore = new TestStore({
      play: [kitCloudkickerSpunkyBearCub],
    });

    const cardUnderTest = testStore.getCard(kitCloudkickerSpunkyBearCub);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
