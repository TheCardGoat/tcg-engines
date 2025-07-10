/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { tritonsDecree } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
