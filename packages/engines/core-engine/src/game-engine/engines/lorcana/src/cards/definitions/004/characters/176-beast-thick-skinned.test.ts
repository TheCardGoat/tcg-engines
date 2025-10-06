/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { beastThickSkinned } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Beast - Thick-Skinned", () => {
  it.skip("**Resist** +1 _(Damage dealt to this character is reduced by 1 )_", () => {
    const testStore = new TestStore({
      play: [beastThickSkinned],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      beastThickSkinned.id,
    );
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
