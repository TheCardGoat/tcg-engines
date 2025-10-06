/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { archimedesExasperatedOwl } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Archimedes - Exasperated Owl", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: archimedesExasperatedOwl.cost,
      play: [archimedesExasperatedOwl],
    });

    const cardUnderTest = testStore.getCard(archimedesExasperatedOwl);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
