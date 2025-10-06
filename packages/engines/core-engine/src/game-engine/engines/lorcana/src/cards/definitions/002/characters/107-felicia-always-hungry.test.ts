/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { feliciaAlwaysHungry } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
