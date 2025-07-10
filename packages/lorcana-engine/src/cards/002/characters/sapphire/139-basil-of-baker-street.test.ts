/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { basilOfBakerStreet } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Basil - Of Baker Street", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: basilOfBakerStreet.cost,

      play: [basilOfBakerStreet],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      basilOfBakerStreet.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
