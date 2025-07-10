/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { kidaRoyalWarrior } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Kida - Royal Warrior", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
    const testStore = new TestStore({
      play: [kidaRoyalWarrior],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", kidaRoyalWarrior.id);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
