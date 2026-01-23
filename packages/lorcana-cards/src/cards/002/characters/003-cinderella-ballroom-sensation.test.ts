import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { cinderellaBallroomSensation } from "./003-cinderella-ballroom-sensation";

describe("Cinderella - Ballroom Sensation", () => {
  it("should have Singer 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [cinderellaBallroomSensation],
    });

    const cardUnderTest = testEngine.getCardModel(cinderellaBallroomSensation);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Cinderella - Ballroom Sensation", () => {
//   it("Singer", () => {
//     const testStore = new TestStore({
//       play: [cinderellaBallroomSensation],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       cinderellaBallroomSensation.id,
//     );
//
//     expect(cardUnderTest.hasSinger).toEqual(true);
//   });
// });
//
