/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { balooVonBruinwaldXiii } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Baloo - von Bruinwald XIII", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**LET'S MAKE LIKE A TREE** When this character is banished, gain 2 lore.", () => {
    const testStore = new TestStore({
      play: [balooVonBruinwaldXiii],
    });

    const cardUnderTest = testStore.getCard(balooVonBruinwaldXiii);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
