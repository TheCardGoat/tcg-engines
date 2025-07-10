/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { rajahRoyalProtector } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
