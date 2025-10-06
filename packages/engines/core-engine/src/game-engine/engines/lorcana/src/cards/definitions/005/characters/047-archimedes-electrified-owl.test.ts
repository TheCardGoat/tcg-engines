/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { archimedesElectrifiedOwl } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
