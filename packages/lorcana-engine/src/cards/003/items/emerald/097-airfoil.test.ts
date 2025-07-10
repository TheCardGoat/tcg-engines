/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { airfoil } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { gatheringKnowledgeAndWisdom } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Airfoil", () => {
  it("**I GOT TO BE GOING** -> Do nothing on <2 actions played", () => {
    const testStore = new TestStore({
      inkwell: gatheringKnowledgeAndWisdom.cost,
      hand: [gatheringKnowledgeAndWisdom],
      play: [airfoil],
      deck: [goonsMaleficent],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", airfoil.id);
    const action = testStore.getByZoneAndId(
      "hand",
      gatheringKnowledgeAndWisdom.id,
    );

    action.playFromHand();
    testStore.resolveTopOfStack({});

    cardUnderTest.activate();
    testStore.resolveTopOfStack({});

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 0 }),
    );
  });

  it("**I GOT TO BE GOING** -> Draw 1", () => {
    const testStore = new TestStore({
      inkwell: gatheringKnowledgeAndWisdom.cost * 2,
      hand: [gatheringKnowledgeAndWisdom, gatheringKnowledgeAndWisdom],
      play: [airfoil],
      deck: [goonsMaleficent],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", airfoil.id);

    const action = testStore.getByZoneAndId(
      "hand",
      gatheringKnowledgeAndWisdom.id,
    );

    action.playFromHand();
    testStore.resolveTopOfStack({});

    const otherAction = testStore.getByZoneAndId(
      "hand",
      gatheringKnowledgeAndWisdom.id,
    );
    otherAction.playFromHand();
    testStore.resolveTopOfStack({});

    cardUnderTest.activate();
    testStore.resolveTopOfStack({});

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1 }),
    );
  });
});
