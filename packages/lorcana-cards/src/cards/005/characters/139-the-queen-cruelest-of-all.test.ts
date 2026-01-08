import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { theQueenCruelestOfAll } from "./139-the-queen-cruelest-of-all";

describe("The Queen - Cruelest of All", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [theQueenCruelestOfAll],
    });

    const cardUnderTest = testEngine.getCardModel(theQueenCruelestOfAll);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { theQueenCruelestOfAll } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("The Queen - Cruelest of All", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: theQueenCruelestOfAll.cost,
//       play: [theQueenCruelestOfAll],
//     });
//
//     const cardUnderTest = testStore.getCard(theQueenCruelestOfAll);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
