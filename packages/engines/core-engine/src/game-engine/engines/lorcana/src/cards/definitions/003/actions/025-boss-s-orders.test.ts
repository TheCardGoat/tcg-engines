/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { bosssOrders } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Boss's Orders", () => {
  it("Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      inkwell: bosssOrders.cost,
      hand: [bosssOrders],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", bosssOrders.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.hasSupport).toBe(true);

    testStore.passTurn();

    expect(target.hasSupport).toBe(false);
  });
});
