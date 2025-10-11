import { describe, expect, it } from "bun:test";
import { plutoTriedAndTrue } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pluto - Tried and True", () => {
  it("HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      inkwell: plutoTriedAndTrue.cost,
      play: [plutoTriedAndTrue],
      hand: [],
    });

    const cardUnderTest = testEngine.getCardModel(plutoTriedAndTrue);
    expect(cardUnderTest.hasSupport()).toBe(true);
    expect(cardUnderTest.strength).toBe(4);

    testEngine.setCardDamage(cardUnderTest, 1);
    expect(cardUnderTest.hasSupport()).toBe(false);
    expect(cardUnderTest.strength).toBe(2);
  });
});
