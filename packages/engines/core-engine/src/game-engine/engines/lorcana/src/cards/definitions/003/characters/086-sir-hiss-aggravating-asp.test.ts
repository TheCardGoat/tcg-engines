import { describe, expect, it } from "bun:test";
import { sirHissAggravatingAsp } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sir Hiss - Aggravating Asp", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [sirHissAggravatingAsp],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      sirHissAggravatingAsp.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
