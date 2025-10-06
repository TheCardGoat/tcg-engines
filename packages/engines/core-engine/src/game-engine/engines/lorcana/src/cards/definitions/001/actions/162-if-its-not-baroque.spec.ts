import { describe, expect, it } from "bun:test";
import { ifItsNotBaroque } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { shieldOfVirtue } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("If it's Not Baroque", () => {
  it("Return item from discard.", () => {
    const testStore = new TestStore({
      inkwell: ifItsNotBaroque.cost,
      hand: [ifItsNotBaroque],
      discard: [shieldOfVirtue],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", ifItsNotBaroque.id);
    const target = testStore.getByZoneAndId("discard", shieldOfVirtue.id);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("hand");
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, discard: 1, play: 0 }),
    );
  });
});
