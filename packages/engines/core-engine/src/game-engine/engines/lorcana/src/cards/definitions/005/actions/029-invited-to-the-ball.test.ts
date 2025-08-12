import { describe, expect, it } from "bun:test";
import { invitedToTheBallAction } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
