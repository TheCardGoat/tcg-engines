import { describe, expect, it } from "bun:test";
import { makeThePotion } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Make the Potion", () => {
  it.skip("Choose one:· Banish chosen item.· Deal 2 damage to chosen damaged character.", () => {
    const testStore = new TestStore({
      inkwell: makeThePotion.cost,
      hand: [makeThePotion],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", makeThePotion.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
