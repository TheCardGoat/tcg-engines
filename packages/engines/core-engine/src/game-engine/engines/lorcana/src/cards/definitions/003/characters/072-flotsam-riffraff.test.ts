/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { flotsamRiffraff } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
