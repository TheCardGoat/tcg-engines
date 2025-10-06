/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { beastWounded } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Beast - Wounded", () => {
  it("**THAT HURTS!** This character enters play with 4 damage.", () => {
    const testStore = new TestStore({
      inkwell: beastWounded.cost,
      hand: [beastWounded],
    });

    const cardUnderTest = testStore.getCard(beastWounded);

    cardUnderTest.playFromHand();
    expect(cardUnderTest.damage).toEqual(4);
  });
});
