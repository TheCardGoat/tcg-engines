import { describe, expect, it } from "bun:test";
import { iagoPrettyPolly } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Iago - Pretty Polly", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [iagoPrettyPolly],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", iagoPrettyPolly.id);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
