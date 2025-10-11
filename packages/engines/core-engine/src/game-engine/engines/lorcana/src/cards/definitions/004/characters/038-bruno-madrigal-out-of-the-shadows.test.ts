import { describe, it } from "bun:test";
import { brunoMadrigalOutOfTheShadows } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
