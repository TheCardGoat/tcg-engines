/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { herculesClumsyKid } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Hercules - Clumsy Kid", () => {
  it.skip("**Rush** _(This character can challenge the turn they're played.)_", () => {
    const testStore = new TestStore({
      play: [herculesClumsyKid],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      herculesClumsyKid.id,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
