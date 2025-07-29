import { describe, expect, it } from "bun:test";
import { baBoom } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { agrabahMarketplace } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ba-Boom!", () => {
  it("Deal 2 damage to chosen character.", () => {
    const testStore = new TestStore({
      inkwell: baBoom.cost,
      hand: [baBoom],
      play: [mrSmeeBumblingMate],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", baBoom.id);
    const target = testStore.getByZoneAndId("play", mrSmeeBumblingMate.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.damage).toBe(2);
  });

  it("Deal 2 damage to chosen location.", () => {
    const testStore = new TestStore({
      inkwell: baBoom.cost,
      hand: [baBoom],
      play: [agrabahMarketplace],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", baBoom.id);
    const target = testStore.getByZoneAndId("play", agrabahMarketplace.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.damage).toBe(2);
  });
});
