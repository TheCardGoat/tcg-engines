import { describe, expect, it } from "bun:test";
import { stitchLittleRocket } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Stitch - Little Rocket", () => {
  it.skip("**Rush** _(This character can challenge the turn they’re played.)_", () => {
    const testStore = new TestStore({
      play: [stitchLittleRocket],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      stitchLittleRocket.id,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
