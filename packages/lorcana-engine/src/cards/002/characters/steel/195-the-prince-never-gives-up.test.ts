/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { thePrinceNeverGivesUp } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Prince- Never Gives Up", () => {
  it("Bodyguard", () => {
    const testStore = new TestStore({
      play: [thePrinceNeverGivesUp],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      thePrinceNeverGivesUp.id,
    );

    expect(cardUnderTest.hasBodyguard).toBe(true);
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
