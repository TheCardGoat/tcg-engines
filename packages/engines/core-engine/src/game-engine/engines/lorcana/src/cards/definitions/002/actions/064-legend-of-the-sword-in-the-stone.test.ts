import { describe, expect, it } from "bun:test";
import { legendOfTheSwordInTheStone } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
