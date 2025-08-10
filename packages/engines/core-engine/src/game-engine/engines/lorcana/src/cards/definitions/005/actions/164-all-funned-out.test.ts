import { describe, expect, it } from "bun:test";
import { allFunnedOut } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("All Funned Out", () => {
  it.skip("Put chosen character of yours into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: allFunnedOut.cost,
      hand: [allFunnedOut],
    });

    const cardUnderTest = testStore.getCard(allFunnedOut);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
