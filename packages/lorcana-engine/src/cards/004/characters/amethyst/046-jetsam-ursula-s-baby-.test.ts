/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jetsamUrsulasBaby } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Jetsam - Ursula's Baby", () => {
  it.skip("**Challenger** +2 _(While challenging, this character gets +2 {S}.)_**OMINOUS PAIR** Your characters named Flotsam gain **Challenger** +2.", () => {
    const testStore = new TestStore({
      play: [jetsamUrsulasBaby],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      jetsamUrsulasBaby.id,
    );
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
