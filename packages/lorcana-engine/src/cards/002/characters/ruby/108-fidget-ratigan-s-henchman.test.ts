/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { fidgetRatigansHenchman } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Fidget - Ratigan’s Henchman", () => {
  it("", () => {
    const testStore = new TestStore({
      play: [fidgetRatigansHenchman],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      fidgetRatigansHenchman.id,
    );

    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
