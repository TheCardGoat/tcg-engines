/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  nothingToHide,
  zeroToHero,
} from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { tiggerOneOfAKind } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Tigger - One of a Kind", () => {
  it("**ENERGETIC** Whenever you play an action, this character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: nothingToHide.cost + zeroToHero.cost,
      hand: [nothingToHide, zeroToHero],
      play: [tiggerOneOfAKind],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", tiggerOneOfAKind.id);

    const actionOne = testStore.getByZoneAndId("hand", nothingToHide.id);
    actionOne.playFromHand();
    expect(cardUnderTest.strength).toBe(tiggerOneOfAKind.strength + 2);

    const actionTwo = testStore.getByZoneAndId("hand", zeroToHero.id);
    actionTwo.playFromHand();
    expect(cardUnderTest.strength).toBe(tiggerOneOfAKind.strength + 4);
  });
});
