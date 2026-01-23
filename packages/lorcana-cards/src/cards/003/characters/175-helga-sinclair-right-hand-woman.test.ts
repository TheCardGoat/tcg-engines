import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { helgaSinclairRighthandWoman } from "./175-helga-sinclair-right-hand-woman";

describe("Helga Sinclair - Right-Hand Woman", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [helgaSinclairRighthandWoman],
    });

    const cardUnderTest = testEngine.getCardModel(helgaSinclairRighthandWoman);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { helgaSinclairRightHandWoman } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Helga Sinclair - Right-Hand Woman", () => {
//   it.skip("**Challenger** +2 _(While challenging, this character gets +2 {S}.)_", () => {
//     const testStore = new TestStore({
//       play: [helgaSinclairRightHandWoman],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       helgaSinclairRightHandWoman.id,
//     );
//     expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
