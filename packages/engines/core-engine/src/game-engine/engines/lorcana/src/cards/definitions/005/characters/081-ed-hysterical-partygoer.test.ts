/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { edHystericalPartygoer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Ed - Hysterical Partygoer", () => {
  it.skip("**ROWDY GUEST** Damaged characters can’t challenge this character.", () => {
    const testStore = new TestStore({
      inkwell: edHystericalPartygoer.cost,
      play: [edHystericalPartygoer],
    });

    const cardUnderTest = testStore.getCard(edHystericalPartygoer);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
