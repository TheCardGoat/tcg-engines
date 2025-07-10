/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { stitchLittleRocket } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Stitch - Little Rocket", () => {
  it.skip("**Rush** _(This character can challenge the turn they’re played.)_", () => {
    const testStore = new TestStore({
      play: [stitchLittleRocket],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      stitchLittleRocket.id,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
