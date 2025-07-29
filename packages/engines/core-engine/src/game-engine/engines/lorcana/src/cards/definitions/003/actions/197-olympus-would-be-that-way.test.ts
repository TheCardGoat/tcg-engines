import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { olympusWouldBeThatWay } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Olympus Would Be That Way", () => {
  it("Your characters get +3 {S} this turn while challenging a location.", () => {
    const testStore = new TestStore({
      inkwell: olympusWouldBeThatWay.cost,
      hand: [olympusWouldBeThatWay],
      play: [mickeyBraveLittleTailor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      olympusWouldBeThatWay.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({});

    expect(testStore.getZonesCardCount().discard).toBe(1); // Olympus Would Be That Way goes to discard
  });
});
