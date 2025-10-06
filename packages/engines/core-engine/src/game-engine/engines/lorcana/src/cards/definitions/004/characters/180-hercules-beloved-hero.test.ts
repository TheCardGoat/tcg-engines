/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { herculesBelovedHero } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Hercules - Beloved Hero", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**Resist +1** _(Damage dealt to this character is reduced by 1.)_", () => {
    const testStore = new TestStore({
      play: [herculesBelovedHero],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      herculesBelovedHero.id,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
