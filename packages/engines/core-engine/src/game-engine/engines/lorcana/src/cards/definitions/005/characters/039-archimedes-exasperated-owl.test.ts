import { describe, it } from "bun:test";
import { archimedesExasperatedOwl } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
