import { describe, it } from "bun:test";
import { imperialProclamation } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Imperial Proclamation", () => {
  it.skip("**CALL TO THE FRONT** Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: imperialProclamation.cost,
      play: [imperialProclamation],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      imperialProclamation.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
