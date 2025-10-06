/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { kitCloudkickerSpunkyBearCub } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Kit Cloudkicker - Spunky Bear Cub", () => {
  it.skip("**Ward** (Opponents can't choose this character except to challenge.)", () => {
    const testStore = new TestStore({
      play: [kitCloudkickerSpunkyBearCub],
    });

    const cardUnderTest = testStore.getCard(kitCloudkickerSpunkyBearCub);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
