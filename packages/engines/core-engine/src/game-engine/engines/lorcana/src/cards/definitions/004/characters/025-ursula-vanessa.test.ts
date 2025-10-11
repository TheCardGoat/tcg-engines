import { describe, expect, it } from "bun:test";
import { ursulaVanessa } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula - Vanessa", () => {
  it("**Singer** 4 _(This character counts as cost 4 to sing songs.)_", () => {
    const testStore = new TestStore({
      play: [ursulaVanessa],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", ursulaVanessa.id);
    expect(cardUnderTest.hasSinger).toBe(true);
  });
});
