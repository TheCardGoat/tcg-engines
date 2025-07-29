import { describe, expect, it } from "bun:test";
import {
  liloMakingAWish,
  stichtNewDog,
  tiggerWonderfulThing,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { strengthOfARagingFire } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Strength of a Raging Fire", () => {
  it("Deal damage to chosen character equal to the number of characters you have in play.", () => {
    const testStore = new TestStore({
      inkwell: strengthOfARagingFire.cost,
      hand: [strengthOfARagingFire],
      play: [
        goofyKnightForADay,
        liloMakingAWish,
        stichtNewDog,
        tiggerWonderfulThing,
      ],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      strengthOfARagingFire.id,
    );
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toEqual(4);
  });
});
