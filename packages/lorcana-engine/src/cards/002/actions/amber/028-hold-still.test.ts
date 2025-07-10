/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { holdStill } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Hold Still", () => {
  it("Remove up to 4 damage from chosen character.", () => {
    const testStore = new TestStore({
      inkwell: holdStill.cost,
      hand: [holdStill],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", holdStill.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    target.updateCardDamage(5);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toBe(1);
  });
});
