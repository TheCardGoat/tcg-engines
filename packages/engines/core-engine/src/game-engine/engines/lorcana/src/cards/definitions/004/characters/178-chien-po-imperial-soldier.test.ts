/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { chienPoImperialSoldier } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Chien-Po - Imperial Soldier", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must chose one with Bodyguard if able.)_", () => {
    const testStore = new TestStore({
      play: [chienPoImperialSoldier],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      chienPoImperialSoldier.id,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
