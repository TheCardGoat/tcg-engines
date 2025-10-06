/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { helgaSinclairRightHandWoman } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Helga Sinclair - Right-Hand Woman", () => {
  it.skip("**Challenger** +2 _(While challenging, this character gets +2 {S}.)_", () => {
    const testStore = new TestStore({
      play: [helgaSinclairRightHandWoman],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      helgaSinclairRightHandWoman.id,
    );
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
