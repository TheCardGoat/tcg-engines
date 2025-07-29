/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { findersKeepers } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

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
