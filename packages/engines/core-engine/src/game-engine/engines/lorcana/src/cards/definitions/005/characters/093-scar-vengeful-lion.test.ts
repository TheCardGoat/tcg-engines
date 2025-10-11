import { describe, it } from "bun:test";
import { scarVengefulLion } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scar - Vengeful Lion", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: scarVengefulLion.cost,
      play: [scarVengefulLion],
    });

    const cardUnderTest = testStore.getCard(scarVengefulLion);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**LIFE'S NOT FAIR, IS IT?** Whenever one of your characters challenges a damaged character, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: scarVengefulLion.cost,
      play: [scarVengefulLion],
    });

    const cardUnderTest = testStore.getCard(scarVengefulLion);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
