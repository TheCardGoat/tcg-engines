/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { alanadaleRockinRooster } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Alan-a-Dale - Rockin' Rooster", () => {
  it.skip("**FAN FAVORITE** Whenever you play a song, gain 1 lore.", () => {
    const testStore = new TestStore({
      inkwell: alanadaleRockinRooster.cost,
      play: [alanadaleRockinRooster],
    });

    const cardUnderTest = testStore.getCard(alanadaleRockinRooster);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
