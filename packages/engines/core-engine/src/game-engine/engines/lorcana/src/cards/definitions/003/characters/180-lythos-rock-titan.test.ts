import { describe, expect, it } from "bun:test";
import { lythosRockTitan } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lythos - Rock Titan", () => {
  it.skip("**Resist** +2 _(Damage dealt to this character is reduced by 2.)_**STONE SKIN** {E} − Chosen character gains **Resist** +2 this turn.", () => {
    const testStore = new TestStore({
      play: [lythosRockTitan],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", lythosRockTitan.id);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
