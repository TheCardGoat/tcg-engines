/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { whatDidYouCallMe } from "@lorcanito/lorcana-engine/cards/002/actions/actions.ts";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("What did you call me?", () => {
  it("[NON DAMAGED] Chosen damaged character gets +3 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: whatDidYouCallMe.cost,
      hand: [whatDidYouCallMe],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", whatDidYouCallMe.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toBe(goofyKnightForADay.strength);
  });

  it("Chosen damaged character gets +3 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: whatDidYouCallMe.cost,
      hand: [whatDidYouCallMe],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", whatDidYouCallMe.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
    target.updateCardDamage(1);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toBe(goofyKnightForADay.strength + 3);
  });
});
