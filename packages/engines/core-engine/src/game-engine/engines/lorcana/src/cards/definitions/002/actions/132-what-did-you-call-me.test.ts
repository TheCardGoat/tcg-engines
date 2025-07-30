import { describe, expect, it } from "bun:test";
import { whatDidYouCallMe } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
