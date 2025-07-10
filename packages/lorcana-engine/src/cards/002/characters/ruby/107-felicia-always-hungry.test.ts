/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { feliciaAlwaysHungry } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Felicia - Always Hungry", () => {
  it("Reckless", () => {
    const testStore = new TestStore({
      play: [feliciaAlwaysHungry],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      feliciaAlwaysHungry.id,
    );

    expect(cardUnderTest.hasReckless).toBe(true);
  });
});
