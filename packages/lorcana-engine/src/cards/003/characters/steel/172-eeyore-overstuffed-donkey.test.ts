/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { eeyoreOverstuffedDonkey } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Eeyore - Overstuffed Donkey", () => {
  it("**Resist** +1 _(Damage dealt to this character is reduced by 1.)_", () => {
    const testStore = new TestStore({
      inkwell: eeyoreOverstuffedDonkey.cost,
      play: [eeyoreOverstuffedDonkey],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      eeyoreOverstuffedDonkey.id,
    );

    expect(cardUnderTest.hasResist).toBe(true);
  });
});
