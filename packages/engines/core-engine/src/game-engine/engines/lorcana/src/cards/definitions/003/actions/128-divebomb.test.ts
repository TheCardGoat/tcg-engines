import { describe, expect, it } from "bun:test";
import { divebomb } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Divebomb", () => {
  it.skip("Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.", () => {
    const testStore = new TestStore({
      inkwell: divebomb.cost,
      hand: [divebomb],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", divebomb.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
