/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { eeyoreOverstuffedDonkey } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
