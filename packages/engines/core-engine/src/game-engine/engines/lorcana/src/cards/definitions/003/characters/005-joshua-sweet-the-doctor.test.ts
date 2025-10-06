/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { joshuaSweetTheDoctor } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Joshua Sweet - The Doctor", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
    const testStore = new TestStore({
      play: [joshuaSweetTheDoctor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      joshuaSweetTheDoctor.id,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
