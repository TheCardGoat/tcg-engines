/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { brunoMadrigalOutOfTheShadows } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Bruno Madrigal - Out of the Shadows", () => {
  it.skip("**IT WAS YOUR VISION** When you play this character, chosen character gains 'When this character is banished in a challenge, you may return this card to your hand' this turn.", () => {
    const testStore = new TestStore({
      inkwell: brunoMadrigalOutOfTheShadows.cost,
      hand: [brunoMadrigalOutOfTheShadows],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      brunoMadrigalOutOfTheShadows.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
