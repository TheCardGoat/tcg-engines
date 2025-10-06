/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { minnieMouseFunkySpelunker } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { forbiddenMountainMaleficentsCastle } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/indext";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Minnie Mouse - Funky Spelunker", () => {
  it("**JOURNEY** While this character is at a location, she gets +2 {S}.", () => {
    const testStore = new TestStore({
      inkwell: forbiddenMountainMaleficentsCastle.moveCost,
      play: [minnieMouseFunkySpelunker, forbiddenMountainMaleficentsCastle],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      minnieMouseFunkySpelunker.id,
    );
    const location = testStore.getByZoneAndId(
      "play",
      forbiddenMountainMaleficentsCastle.id,
    );

    expect(cardUnderTest.strength).toEqual(minnieMouseFunkySpelunker.strength);
    cardUnderTest.enterLocation(location);
    expect(cardUnderTest.strength).toEqual(
      minnieMouseFunkySpelunker.strength + 2,
    );
  });
});
