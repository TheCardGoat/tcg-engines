/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { holdStill } from "@lorcanito/lorcana-engine/cards/002/actions/actions.ts";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
