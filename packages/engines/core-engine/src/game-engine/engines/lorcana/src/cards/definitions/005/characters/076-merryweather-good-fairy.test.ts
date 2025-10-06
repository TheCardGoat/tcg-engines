/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  merryweatherGoodFairy,
  monstroWhaleOfAWhale,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Merryweather - Good Fairy", () => {
  it("**RAY OF HOPE** When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: merryweatherGoodFairy.cost + 1,
      hand: [merryweatherGoodFairy],
      play: [monstroWhaleOfAWhale],
    });

    const cardUnderTest = testStore.getCard(merryweatherGoodFairy);
    const target = testStore.getCard(monstroWhaleOfAWhale);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toBe(monstroWhaleOfAWhale.strength + 2);
  });
});
