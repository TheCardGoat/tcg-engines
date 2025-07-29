import { describe, expect, it } from "bun:test";
import { goonsMaleficent } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { findersKeepers } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Finders Keepers", () => {
  it("Draw 3 cards.", () => {
    const testEngine = new TestEngine({
      inkwell: findersKeepers.cost,
      hand: [findersKeepers],
      deck: [goonsMaleficent, goonsMaleficent, goonsMaleficent],
    });

    const cardUnderTest = testEngine.getCardModel(findersKeepers);
    cardUnderTest.playFromHand();
    expect(testEngine.getZonesCardCount().hand).toBe(3);
  });
});
