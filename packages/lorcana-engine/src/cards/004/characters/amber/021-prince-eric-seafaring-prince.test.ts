/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { princeEricSeafaringPrince } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
