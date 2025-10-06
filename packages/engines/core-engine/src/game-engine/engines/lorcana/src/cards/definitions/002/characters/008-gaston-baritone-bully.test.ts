/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { gastonBaritoneBully } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
