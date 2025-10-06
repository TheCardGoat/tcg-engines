/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseDetective } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { oneJumpAhead } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import {
  chichaDedicatedMother,
  petePastryChomper,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Chicha - Dedicated Mother", () => {
  it("During your turn, when you put a card into your inkwell, if it’s the second card you’ve put into your inkwell this turn, you may draw a card.", () => {
    const initialInkwell = oneJumpAhead.cost + mickeyMouseDetective.cost;
    const initialDeck = 5;
    const initialHand = 3;
    const testStore = new TestStore({
      inkwell: initialInkwell,
      play: [chichaDedicatedMother],
      hand: [oneJumpAhead, mickeyMouseDetective, petePastryChomper],
      deck: initialDeck,
    });

    const cardToInkwell = testStore.getCard(petePastryChomper);

    cardToInkwell.addToInkwell();
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: initialHand - 1,
        inkwell: initialInkwell + 1,
        deck: initialDeck,
      }),
    );

    const rampOne = testStore.getCard(oneJumpAhead);
    rampOne.playFromHand();
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: initialHand - 2,
        inkwell: initialInkwell + 2,
        deck: initialDeck - 1,
      }),
    );

    expect(testStore.stackLayers).toHaveLength(1);
    testStore.resolveOptionalAbility();
    expect(testStore.stackLayers).toHaveLength(0);

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: initialHand - 1,
        inkwell: initialInkwell + 2,
        deck: initialDeck - 2,
      }),
    );

    const rampTwo = testStore.getCard(mickeyMouseDetective);
    rampTwo.playFromHand();
    testStore.resolveOptionalAbility();

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: initialHand - 2,
        inkwell: initialInkwell + 3,
        deck: initialDeck - 3,
      }),
    );

    expect(testStore.stackLayers).toHaveLength(0);
  });
});
