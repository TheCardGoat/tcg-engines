import { describe, expect, it } from "bun:test";
import { fishboneQuill } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { touchedMyHeart } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Touched My Heart", () => {
  it("_(A character with cost 2 or more can {E} to sing this song for free.)_Banish chosen item.", () => {
    const testStore = new TestStore({
      inkwell: touchedMyHeart.cost,
      hand: [touchedMyHeart],
      play: [fishboneQuill],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", touchedMyHeart.id);
    const targetItem = testStore.getByZoneAndId("play", fishboneQuill.id);

    expect(targetItem.zone).toBe("play");

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targets: [targetItem],
    });

    expect(targetItem.zone).toBe("discard");
    expect(testStore.getZonesCardCount().play).toBe(0);
    expect(testStore.getZonesCardCount().discard).toBe(2); // item + action card
  });
});
