/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { gatheringKnowledgeAndWisdom } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Gathering Knowledge And Wisdom", () => {
  it.skip("Gain 2 lore.", () => {
    const testStore = new TestStore({
      inkwell: gatheringKnowledgeAndWisdom.cost,
      hand: [gatheringKnowledgeAndWisdom],
    });

    const cardUnderTest = testStore.getCard(gatheringKnowledgeAndWisdom);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
