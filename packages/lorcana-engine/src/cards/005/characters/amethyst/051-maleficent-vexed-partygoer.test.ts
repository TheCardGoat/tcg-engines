/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { maleficentVexedPartygoer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Maleficent - Vexed Partygoer", () => {
  it.skip("**WHAT AN AWKWARD SITUATION** Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player’s hand.", () => {
    const testStore = new TestStore({
      inkwell: maleficentVexedPartygoer.cost,
      play: [maleficentVexedPartygoer],
    });

    const cardUnderTest = testStore.getCard(maleficentVexedPartygoer);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
