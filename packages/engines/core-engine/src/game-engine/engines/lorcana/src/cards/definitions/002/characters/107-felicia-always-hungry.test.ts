/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { feliciaAlwaysHungry } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
