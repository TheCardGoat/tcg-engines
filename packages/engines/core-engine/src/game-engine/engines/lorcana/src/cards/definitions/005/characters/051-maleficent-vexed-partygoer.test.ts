/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { maleficentVexedPartygoer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import {
  charlotteLaBouffMardiGrasPrincess,
  deweyLovableShowoff,
} from "../../008";

describe("Maleficent - Vexed Partygoer", () => {
  it("**WHAT AN AWKWARD SITUATION** Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player’s hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: maleficentVexedPartygoer.cost,
      play: [maleficentVexedPartygoer, charlotteLaBouffMardiGrasPrincess],
      hand: [deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(maleficentVexedPartygoer);
    const cardTODiscard = testEngine.getCardModel(deweyLovableShowoff);
    const cardToBounce = testEngine.getCardModel(
      charlotteLaBouffMardiGrasPrincess,
    );

    await testEngine.questCard(cardUnderTest);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [cardTODiscard] }, true);
    await testEngine.resolveTopOfStack({ targets: [cardToBounce] });

    expect(cardTODiscard.zone).toBe("discard");
    expect(cardToBounce.zone).toBe("hand");
  });
});
