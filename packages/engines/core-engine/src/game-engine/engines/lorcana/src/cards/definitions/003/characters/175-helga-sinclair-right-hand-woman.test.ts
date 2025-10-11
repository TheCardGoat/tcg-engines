import { describe, expect, it } from "bun:test";
import { helgaSinclairRightHandWoman } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Helga Sinclair - Right-Hand Woman", () => {
  it.skip("**Challenger** +2 _(While challenging, this character gets +2 {S}.)_", () => {
    const testStore = new TestStore({
      play: [helgaSinclairRightHandWoman],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      helgaSinclairRightHandWoman.id,
    );
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
