import { describe, it } from "bun:test";
import { peteBornToCheat } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pete - Born to Cheat", () => {
  it.skip("**I CLOBBER YOU!** Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.", () => {
    const testStore = new TestStore({
      inkwell: peteBornToCheat.cost,
      play: [peteBornToCheat],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", peteBornToCheat.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
