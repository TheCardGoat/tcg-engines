import { describe, expect, it } from "bun:test";
import { dellaDuckUnstoppableMom } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Della Duck - Unstoppable Mom", () => {
  it.skip("**Reckless** _(This character can't quest and must challenge each turn if able.)_", () => {
    const testStore = new TestStore({
      play: [dellaDuckUnstoppableMom],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      dellaDuckUnstoppableMom.id,
    );
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
