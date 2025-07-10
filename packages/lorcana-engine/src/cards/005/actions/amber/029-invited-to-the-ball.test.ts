/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { invitedToTheBallAction } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Invited to the Ball", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: invitedToTheBallAction.cost,
      hand: [invitedToTheBallAction],
    });

    const cardUnderTest = testStore.getCard(invitedToTheBallAction);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
