/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { scroopBackstabber } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scroop - Backstabber", () => {
  it.skip("**BRUTE** While this character has damage, he gets +3 {S}.", () => {
    const testStore = new TestStore({
      inkwell: scroopBackstabber.cost,
      play: [scroopBackstabber],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      scroopBackstabber.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
