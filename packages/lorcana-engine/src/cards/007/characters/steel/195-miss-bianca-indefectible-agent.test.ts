/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { missBiancaIndefectibleAgent } from "@lorcanito/lorcana-engine/cards/007";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Miss Bianca - Indefectible Agent", () => {
  it("KEEP HOPE Playing this character costs you 2 {I} less if you have an Ally character in play.", async () => {
    const testStore = new TestStore({
      inkwell: missBiancaIndefectibleAgent.cost - 2,
      hand: [missBiancaIndefectibleAgent],
      play: [goonsMaleficent],
    });

    const cardUnderTest = testStore.getCard(missBiancaIndefectibleAgent);

    cardUnderTest.playFromHand();
    expect(cardUnderTest.zone).toEqual("play");
    expect(testStore.getAvailableInkwellCardCount()).toEqual(0);
  });
});
