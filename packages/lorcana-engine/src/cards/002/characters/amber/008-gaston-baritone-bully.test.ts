/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { gastonBaritoneBully } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Gaston - Baritone Bully", () => {
  it("Singer", () => {
    const testStore = new TestStore({
      inkwell: gastonBaritoneBully.cost,
      play: [gastonBaritoneBully],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      gastonBaritoneBully.id,
    );

    expect(cardUnderTest.hasSinger).toEqual(true);
  });
});
