import { describe, expect, it } from "bun:test";
import {
  dingleHopper,
  shieldOfVirtue,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { treasuresUntold } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Treasures Untold", () => {
  it("_(A character with cost 6 or more can {E} to sing this song for free.)_Return up to 2 item cards from your discard into your hand.", () => {
    const testStore = new TestStore({
      inkwell: treasuresUntold.cost,
      hand: [treasuresUntold],
      discard: [shieldOfVirtue, dingleHopper],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", treasuresUntold.id);
    const item1 = testStore.getByZoneAndId("discard", shieldOfVirtue.id);
    const item2 = testStore.getByZoneAndId("discard", dingleHopper.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [item1, item2] });

    expect(testStore.getZonesCardCount().hand).toBe(2);
    expect(testStore.getZonesCardCount().discard).toBe(1); // Treasures Untold goes to discard
    expect(item1.zone).toBe("hand");
    expect(item2.zone).toBe("hand");
  });
});
