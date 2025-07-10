/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { legendOfTheSwordInTheStone } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Legend of the Sword in the Stone", () => {
  it("Chosen character gains **Challenger** +3 this turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: legendOfTheSwordInTheStone.cost,
        hand: [legendOfTheSwordInTheStone],
        play: [goofyKnightForADay],
      },
      {
        deck: 1,
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      legendOfTheSwordInTheStone.id,
    );
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.hasChallenger).toBe(true);

    testStore.passTurn();

    expect(target.hasChallenger).toBe(false);
  });
});
