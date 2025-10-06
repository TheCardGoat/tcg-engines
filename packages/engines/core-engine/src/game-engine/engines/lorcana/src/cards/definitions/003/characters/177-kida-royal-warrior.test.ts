/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { kidaRoyalWarrior } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Kida - Royal Warrior", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
    const testStore = new TestStore({
      play: [kidaRoyalWarrior],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", kidaRoyalWarrior.id);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
