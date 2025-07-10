/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  maidMarianLadyOfTheLists,
  monstroWhaleOfAWhale,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Maid Marian - Lady of the Lists", () => {
  it("**IF IT PLEASES HTE LADY** When you play this character, opposing character of your choice gets -5 {S} until the start of your next turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: maidMarianLadyOfTheLists.cost,
        hand: [maidMarianLadyOfTheLists],
      },
      {
        play: [monstroWhaleOfAWhale],
      },
    );

    const cardUnderTest = testStore.getCard(maidMarianLadyOfTheLists);
    const target = testStore.getCard(monstroWhaleOfAWhale);
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toEqual(monstroWhaleOfAWhale.strength - 5);
  });
});
