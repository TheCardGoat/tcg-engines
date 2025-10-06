/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { kakamoraBoardingParty } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Kakamora - Boarding Party", () => {
  it.skip("**Rush** _(This character can challenge the turn they’re played.)_", () => {
    const testStore = new TestStore({
      play: [kakamoraBoardingParty],
    });

    const cardUnderTest = testStore.getCard(kakamoraBoardingParty);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
