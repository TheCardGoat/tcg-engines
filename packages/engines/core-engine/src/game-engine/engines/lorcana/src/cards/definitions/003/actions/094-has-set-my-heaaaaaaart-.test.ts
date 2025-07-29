import { describe, expect, it } from "bun:test";
import { fryingPan } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { touchedMyHeart } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Has Set My Heaaaaaaart ...", () => {
  it("Banish chosen item.", () => {
    const testStore = new TestStore({
      inkwell: touchedMyHeart.cost,
      hand: [touchedMyHeart],
      play: [fryingPan],
    });

    const cardUnderTest = testStore.getCard(touchedMyHeart);
    const targetItem = testStore.getByZoneAndId("play", fryingPan.id);

    expect(targetItem.zone).toBe("play");

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({
      targets: [targetItem],
    });

    expect(targetItem.zone).toBe("discard");
  });
});
