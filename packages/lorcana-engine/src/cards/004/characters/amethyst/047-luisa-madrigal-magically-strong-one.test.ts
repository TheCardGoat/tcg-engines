/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { luisaMadrigalMagicallyStrongOne } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Luisa Madrigal - Magically Strong One", () => {
  it.skip("**Rush** _(This character can challenge the turn they're played.)_", () => {
    const testStore = new TestStore({
      play: [luisaMadrigalMagicallyStrongOne],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      luisaMadrigalMagicallyStrongOne.id,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
