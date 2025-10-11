import { describe, expect, it } from "bun:test";
import { princeEricSeafaringPrince } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince Eric - Seafaring Prince", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)_", () => {
    const testStore = new TestStore({
      play: [princeEricSeafaringPrince],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      princeEricSeafaringPrince.id,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
