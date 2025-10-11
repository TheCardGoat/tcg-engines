import { describe, expect, it } from "bun:test";
import { thePrinceNeverGivesUp } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Prince- Never Gives Up", () => {
  it("Bodyguard", () => {
    const testStore = new TestStore({
      play: [thePrinceNeverGivesUp],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      thePrinceNeverGivesUp.id,
    );

    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("Resist 1", () => {
    const testStore = new TestStore({
      play: [thePrinceNeverGivesUp],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      thePrinceNeverGivesUp.id,
    );

    expect(cardUnderTest.hasResist).toBe(true);
  });
});
