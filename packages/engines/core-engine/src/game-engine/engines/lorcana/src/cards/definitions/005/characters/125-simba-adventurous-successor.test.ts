/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { simbaAdventurousSuccessor } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Simba - Adventurous Successor", () => {
  it.skip("**I LAUGH IN THE FACE OF DANGER** When you play this character, chosen character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: simbaAdventurousSuccessor.cost,
      hand: [simbaAdventurousSuccessor],
    });

    const cardUnderTest = testStore.getCard(simbaAdventurousSuccessor);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
