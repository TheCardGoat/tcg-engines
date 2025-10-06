/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { luisaMadrigalMagicallyStrongOne } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

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
