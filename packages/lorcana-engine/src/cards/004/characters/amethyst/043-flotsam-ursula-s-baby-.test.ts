/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { flotsamUrsulasBaby } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Flotsam - Ursula's Baby", () => {
  it.skip("**QUICK ESCAPE** When this character is banished in a challenge, return this card to your hand.**OMINOUS PAIR** Your characters named Jetsam gain 'When this character is banished in a challenge, return this card to your hand.'", () => {
    const testStore = new TestStore({
      inkwell: flotsamUrsulasBaby.cost,
      play: [flotsamUrsulasBaby],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      flotsamUrsulasBaby.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
