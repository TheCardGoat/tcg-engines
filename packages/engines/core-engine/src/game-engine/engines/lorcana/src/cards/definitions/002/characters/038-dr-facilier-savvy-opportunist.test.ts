/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { drFacilierSavvyOpportunist } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
