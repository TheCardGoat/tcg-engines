import { describe, expect, it } from "bun:test";
import { tritonsDecree } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Triton's Decree", () => {
  it.skip("Each opponent chooses one of their characters and deals 2 damage to them.", () => {
    const testStore = new TestStore({
      inkwell: tritonsDecree.cost,
      hand: [tritonsDecree],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", tritonsDecree.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
