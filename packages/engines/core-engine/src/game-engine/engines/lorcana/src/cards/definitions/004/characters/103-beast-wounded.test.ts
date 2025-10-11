import { describe, expect, it } from "bun:test";
import { beastWounded } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
