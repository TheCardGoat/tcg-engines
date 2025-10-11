import { describe, it } from "bun:test";
import { kronkHeadOfSecurity } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kronk - Head of Security", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: kronkHeadOfSecurity.cost,
      play: [kronkHeadOfSecurity],
    });

    const cardUnderTest = testStore.getCard(kronkHeadOfSecurity);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
