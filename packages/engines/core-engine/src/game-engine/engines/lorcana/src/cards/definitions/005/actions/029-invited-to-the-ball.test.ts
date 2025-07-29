import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { invitedToTheBallAction } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

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
