import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { mickeyMouseFoodFightDefender } from "./176-mickey-mouse-food-fight-defender";

describe("Mickey Mouse - Food Fight Defender", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mickeyMouseFoodFightDefender],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseFoodFightDefender);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { mickeyMouseFoodFightDefender } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mickey Mouse - Food Fight Defender", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: mickeyMouseFoodFightDefender.cost,
//       play: [mickeyMouseFoodFightDefender],
//     });
//
//     const cardUnderTest = testStore.getCard(mickeyMouseFoodFightDefender);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
