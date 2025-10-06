/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { tongSurvivor } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Tong - Survivor", () => {
  it.skip("**Reckless** _(This character can't quest and must challenge each turn if able.)_", () => {
    const testStore = new TestStore({
      play: [tongSurvivor],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", tongSurvivor.id);
    expect(cardUnderTest.hasReckless).toBe(true);
  });
});
