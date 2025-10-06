/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goonsMaleficent } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { airfoil } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";
import { gatheringKnowledgeAndWisdom } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
