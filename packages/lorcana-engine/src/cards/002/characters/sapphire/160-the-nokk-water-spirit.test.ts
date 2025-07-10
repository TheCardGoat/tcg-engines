/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { theNokkWaterSpirit } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Nokk - Water Spirit", () => {
  it("has ward", () => {
    const testStore = new TestStore({
      play: [theNokkWaterSpirit],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      theNokkWaterSpirit.id,
    );

    expect(cardUnderTest.hasWard).toEqual(true);
  });
});
