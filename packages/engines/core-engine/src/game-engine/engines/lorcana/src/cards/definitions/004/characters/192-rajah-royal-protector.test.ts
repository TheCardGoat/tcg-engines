import { describe, it } from "bun:test";
import { rajahRoyalProtector } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rajah - Royal Protector", () => {
  it.skip("**STEADY GAZE** While you have no cards in your hand, characters with cost 4 or less can't challenge this character.", () => {
    const testStore = new TestStore({
      inkwell: rajahRoyalProtector.cost,
      play: [rajahRoyalProtector],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      rajahRoyalProtector.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
