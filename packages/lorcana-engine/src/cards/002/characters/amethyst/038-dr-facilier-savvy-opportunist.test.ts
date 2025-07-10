/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { drFacilierSavvyOpportunist } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Dr. Facilier - Savvy Opportunist", () => {
  it.skip("Evasive", () => {
    const testStore = new TestStore({
      play: [drFacilierSavvyOpportunist],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      drFacilierSavvyOpportunist.id,
    );

    expect(cardUnderTest.hasEvasive).toBeTruthy();
  });
});
