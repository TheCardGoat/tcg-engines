import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { minnieMouseStylishSurfer } from "./113-minnie-mouse-stylish-surfer";

describe("Minnie Mouse - Stylish Surfer", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [minnieMouseStylishSurfer],
    });

    const cardUnderTest = testEngine.getCardModel(minnieMouseStylishSurfer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { minnieMouseStylishSurfer } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Minnie Mouse - Stylish Surfer", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: minnieMouseStylishSurfer.cost,
//
//       play: [minnieMouseStylishSurfer],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       minnieMouseStylishSurfer.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
