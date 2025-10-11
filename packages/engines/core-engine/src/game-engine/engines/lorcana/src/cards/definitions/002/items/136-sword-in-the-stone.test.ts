import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { swordInTheStone } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sword In The Stone", () => {
  it("{E}, 2 {I} - Chosen character gets +1 {S} this turn for each 1 damage on them.", () => {
    const testStore = new TestStore({
      inkwell: 2,
      play: [swordInTheStone, goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", swordInTheStone.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    target.updateCardDamage(5);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toEqual(goofyKnightForADay.strength + 5);
  });
});
