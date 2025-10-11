import { describe, expect, it } from "bun:test";
import { lenaSabrewingRebelliousTeenager } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lena Sabrewing - Rebellious Teenager", () => {
  it.skip("**Rush** _(This character can challenge the turn they're played.)_", () => {
    const testStore = new TestStore({
      play: [lenaSabrewingRebelliousTeenager],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      lenaSabrewingRebelliousTeenager.id,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
