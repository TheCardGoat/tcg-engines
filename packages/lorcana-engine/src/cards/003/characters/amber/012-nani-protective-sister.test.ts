/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { naniProtectiveSister } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Nani - Protective Sister", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
    const testStore = new TestStore({
      play: [naniProtectiveSister],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      naniProtectiveSister.id,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
