import { describe, expect, it } from "bun:test";
import { auroraTranquilPrincess } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Aurora - Tranquil Princess", () => {
  it.skip("**Ward** _(Opponents can't choose this character except to challenge.)_", () => {
    const testStore = new TestStore({
      play: [auroraTranquilPrincess],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      auroraTranquilPrincess.id,
    );
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
