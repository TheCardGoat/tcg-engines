import { describe, it } from "bun:test";
import { edHystericalPartygoer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
