/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  annaMysticalMajesty,
  monstroWhaleOfAWhale,
  vanellopeVonSchweetzCandyMechanic,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Anna - Mystical Majesty", () => {
  it("**EXCEPTIONAL POWER** When you play this character, exert all opposing characters.", () => {
    const testStore = new TestStore(
      {
        inkwell: annaMysticalMajesty.cost,
        hand: [annaMysticalMajesty],
      },
      {
        play: [vanellopeVonSchweetzCandyMechanic, monstroWhaleOfAWhale],
      },
    );

    const cardUnderTest = testStore.getCard(annaMysticalMajesty);
    const targets = [
      testStore.getCard(vanellopeVonSchweetzCandyMechanic),
      testStore.getCard(monstroWhaleOfAWhale),
    ];
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({});
    targets.forEach((target) => {
      expect(target.meta.exerted).toEqual(true);
    });
  });
});
