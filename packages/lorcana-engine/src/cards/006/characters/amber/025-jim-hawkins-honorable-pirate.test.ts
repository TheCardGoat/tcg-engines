/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jimHawkinsHonorablePirate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Jim Hawkins - Honorable Pirate", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**HIRE A CREW** When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.", () => {
    const testStore = new TestStore({
      play: [jimHawkinsHonorablePirate],
    });

    const cardUnderTest = testStore.getCard(jimHawkinsHonorablePirate);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
