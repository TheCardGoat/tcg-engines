import { describe, expect, it } from "bun:test";
import { brawl } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { daisyDuckLovelyLady } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Brawl", () => {
  it("Banish chosen character with 2 {S} or less.", () => {
    const testStore = new TestStore({
      inkwell: brawl.cost,
      hand: [brawl],
      play: [daisyDuckLovelyLady],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", brawl.id);
    const target = testStore.getByZoneAndId("play", daisyDuckLovelyLady.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
    expect(cardUnderTest.zone).toEqual("discard");
  });
});
