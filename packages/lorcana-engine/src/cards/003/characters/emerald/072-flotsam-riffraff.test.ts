/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { flotsamRiffraff } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Flotsam - Riffraff", () => {
  it.skip("**EERIE PAIR** Your characters named Jetsam get +3 {S}.", () => {
    const testStore = new TestStore({
      inkwell: flotsamRiffraff.cost,
      play: [flotsamRiffraff],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", flotsamRiffraff.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
