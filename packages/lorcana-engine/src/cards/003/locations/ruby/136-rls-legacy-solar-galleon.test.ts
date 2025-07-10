/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloMakingAWish,
  stichtNewDog,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { rlsLegacySolarGalleon } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("RLS Legacy - Solar Galleon", () => {
  it("**THIS IS OUR SHIP** Characters gain **Evasive** while here. _(Only characters with Evasive can challenge them.)_", () => {
    const testStore = new TestStore({
      inkwell: rlsLegacySolarGalleon.moveCost,
      play: [rlsLegacySolarGalleon, liloMakingAWish],
    });

    const cardUnderTest = testStore.getCard(rlsLegacySolarGalleon);
    const lilo = testStore.getCard(liloMakingAWish);

    expect(lilo.hasEvasive).toBe(false);

    lilo.enterLocation(cardUnderTest);

    expect(lilo.hasEvasive).toBe(true);
  });

  it("**HEAVE TOGETHER NOW** If you have a character here, you pay 2 {I} less to move a character of yours here.", () => {
    const testStore = new TestStore({
      inkwell: rlsLegacySolarGalleon.moveCost + 1,
      play: [rlsLegacySolarGalleon, liloMakingAWish, stichtNewDog],
    });

    const cardUnderTest = testStore.getCard(rlsLegacySolarGalleon);
    const lilo = testStore.getCard(liloMakingAWish);
    const sticht = testStore.getCard(stichtNewDog);

    expect(cardUnderTest.moveCost).toBe(rlsLegacySolarGalleon.moveCost);

    lilo.enterLocation(cardUnderTest);
    sticht.enterLocation(cardUnderTest);

    expect(lilo.isAtLocation(cardUnderTest)).toBe(true);
    expect(cardUnderTest.moveCost).toBe(rlsLegacySolarGalleon.moveCost - 2);
    expect(sticht.isAtLocation(cardUnderTest)).toBe(true);
  });
});
