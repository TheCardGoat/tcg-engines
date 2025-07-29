/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  liloMakingAWish,
  stichtNewDog,
  tiggerWonderfulThing,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { strengthOfARagingFire } from "@lorcanito/lorcana-engine/cards/002/actions/actions.ts";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
