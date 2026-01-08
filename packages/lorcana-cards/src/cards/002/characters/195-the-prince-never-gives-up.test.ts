import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { thePrinceNeverGivesUp } from "./195-the-prince-never-gives-up";

describe("The Prince - Never Gives Up", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thePrinceNeverGivesUp],
    });

    const cardUnderTest = testEngine.getCardModel(thePrinceNeverGivesUp);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thePrinceNeverGivesUp],
    });

    const cardUnderTest = testEngine.getCardModel(thePrinceNeverGivesUp);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { thePrinceNeverGivesUp } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("The Prince- Never Gives Up", () => {
//   it("Bodyguard", () => {
//     const testStore = new TestStore({
//       play: [thePrinceNeverGivesUp],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       thePrinceNeverGivesUp.id,
//     );
//
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   it("Resist 1", () => {
//     const testStore = new TestStore({
//       play: [thePrinceNeverGivesUp],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       thePrinceNeverGivesUp.id,
//     );
//
//     expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
