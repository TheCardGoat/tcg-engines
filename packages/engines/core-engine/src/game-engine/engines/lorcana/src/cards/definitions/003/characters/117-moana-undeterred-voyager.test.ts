import { describe, expect, it } from "bun:test";
import { moanaUndeterredVoyager } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Moana - Undeterred Voyager", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [moanaUndeterredVoyager],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      moanaUndeterredVoyager.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
