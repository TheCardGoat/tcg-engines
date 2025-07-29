/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { healingTouch } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Healing Touch", () => {
  it("Remove up to 4 damage from chosen character. Draw a card.", () => {
    const testStore = new TestStore({
      inkwell: healingTouch.cost,
      hand: [healingTouch],
      play: [goofyKnightForADay],
      deck: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", healingTouch.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    target.updateCardDamage(5);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toBe(1);
  });
});
