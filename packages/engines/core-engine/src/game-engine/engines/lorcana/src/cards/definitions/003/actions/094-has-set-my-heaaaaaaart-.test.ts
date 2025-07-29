/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { fryingPan } from "@lorcanito/lorcana-engine/cards/001/items/items.ts";
import { touchedMyHeart } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
