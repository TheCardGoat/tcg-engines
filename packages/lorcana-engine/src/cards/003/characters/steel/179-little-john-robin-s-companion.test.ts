/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { littleJohnRobinsCompanion } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Little John - Robin's Companion", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**DISGUISED** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_", () => {
    const testStore = new TestStore({
      play: [littleJohnRobinsCompanion],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      littleJohnRobinsCompanion.id,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
