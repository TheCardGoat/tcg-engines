import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { drFacilierSavvyOpportunist } from "./038-dr-facilier-savvy-opportunist";

describe("Dr. Facilier - Savvy Opportunist", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [drFacilierSavvyOpportunist],
    });

    const cardUnderTest = testEngine.getCardModel(drFacilierSavvyOpportunist);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { drFacilierSavvyOpportunist } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Dr. Facilier - Savvy Opportunist", () => {
//   it.skip("Evasive", () => {
//     const testStore = new TestStore({
//       play: [drFacilierSavvyOpportunist],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       drFacilierSavvyOpportunist.id,
//     );
//
//     expect(cardUnderTest.hasEvasive).toBeTruthy();
//   });
// });
//
