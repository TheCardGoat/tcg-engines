/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { happyGoodNatured } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Happy - Good-Natured", () => {
  it("Support", () => {
    const testStore = new TestStore({
      play: [happyGoodNatured],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", happyGoodNatured.id);

    expect(cardUnderTest.hasSupport).toEqual(true);
  });
});
