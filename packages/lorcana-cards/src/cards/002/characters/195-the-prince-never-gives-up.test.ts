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
// Import { describe, expect, it } from "@jest/globals";
// Import { thePrinceNeverGivesUp } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Prince- Never Gives Up", () => {
//   It("Bodyguard", () => {
//     Const testStore = new TestStore({
//       Play: [thePrinceNeverGivesUp],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ThePrinceNeverGivesUp.id,
//     );
//
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It("Resist 1", () => {
//     Const testStore = new TestStore({
//       Play: [thePrinceNeverGivesUp],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ThePrinceNeverGivesUp.id,
//     );
//
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
