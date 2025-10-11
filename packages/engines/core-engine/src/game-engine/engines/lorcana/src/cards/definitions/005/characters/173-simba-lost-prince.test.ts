import { describe, it } from "bun:test";
import { simbaLostPrince } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Simba - Lost Prince", () => {
  it.skip("**FACE THE PAST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: simbaLostPrince.cost,
      play: [simbaLostPrince],
    });

    const cardUnderTest = testStore.getCard(simbaLostPrince);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
