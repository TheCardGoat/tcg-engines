/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { fixitFelixJrNicelandSteward } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { theLibraryAGiftForBelle } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fix‐It Felix, Jr. - Niceland Steward", () => {
  it("**BUILDING TOGETHER** Your locations get +2 {W}️.", () => {
    const testStore = new TestStore({
      inkwell: fixitFelixJrNicelandSteward.cost,
      play: [theLibraryAGiftForBelle, fixitFelixJrNicelandSteward],
    });

    expect(testStore.getCard(theLibraryAGiftForBelle).willpower).toBe(
      theLibraryAGiftForBelle.willpower + 2,
    );
  });
});
