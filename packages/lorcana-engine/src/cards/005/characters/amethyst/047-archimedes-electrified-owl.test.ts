/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { archimedesElectrifiedOwl } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Archimedes - Electrified Owl", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: archimedesElectrifiedOwl.cost,
      play: [archimedesElectrifiedOwl],
    });

    const cardUnderTest = testStore.getCard(archimedesElectrifiedOwl);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: archimedesElectrifiedOwl.cost,
      play: [archimedesElectrifiedOwl],
    });

    const cardUnderTest = testStore.getCard(archimedesElectrifiedOwl);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: archimedesElectrifiedOwl.cost,
      play: [archimedesElectrifiedOwl],
    });

    const cardUnderTest = testStore.getCard(archimedesElectrifiedOwl);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
