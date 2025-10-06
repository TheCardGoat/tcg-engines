/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  nothingToHide,
  zeroToHero,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { tiggerOneOfAKind } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
