import { describe, expect, it } from "bun:test";
import { youCanFly } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("You Can Fly", () => {
  it("Chosen character gains **Evasive** until the start of your next turn.", () => {
    const testStore = new TestStore({
      inkwell: youCanFly.cost,
      hand: [youCanFly],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", youCanFly.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    expect(target.hasEvasive).toBe(false);
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.hasEvasive).toBe(true);
  });
});
