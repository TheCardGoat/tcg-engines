/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  donaldDuckFocusedFlatfoot,
  tipoGrowingSon,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Donald Duck - Focused Flatfoot", () => {
  it("**BAFFLING MYSTERY** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: donaldDuckFocusedFlatfoot.cost,
      hand: [donaldDuckFocusedFlatfoot],
      deck: [tipoGrowingSon],
    });

    const cardUnderTest = testStore.getCard(donaldDuckFocusedFlatfoot);
    const topDeckCard = testStore.getCard(tipoGrowingSon);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [topDeckCard] });

    expect(topDeckCard.zone).toEqual("inkwell");
    expect(topDeckCard.ready).toEqual(false);
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });
});
