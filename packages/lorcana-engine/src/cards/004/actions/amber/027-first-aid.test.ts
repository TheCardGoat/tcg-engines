/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { firstAid } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("First Aid", () => {
  it.skip("Remove up to 1 damage from each of your characters.", () => {
    const testStore = new TestStore({
      inkwell: firstAid.cost,
      hand: [firstAid],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", firstAid.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
