import { describe, expect, it } from "bun:test";
import { holdStill } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
