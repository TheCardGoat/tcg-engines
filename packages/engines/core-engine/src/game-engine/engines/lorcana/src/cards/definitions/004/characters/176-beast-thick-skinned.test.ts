/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { beastThickSkinned } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
