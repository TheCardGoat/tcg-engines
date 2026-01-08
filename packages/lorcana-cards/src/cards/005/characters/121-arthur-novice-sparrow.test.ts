import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { arthurNoviceSparrow } from "./121-arthur-novice-sparrow";

describe("Arthur - Novice Sparrow", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [arthurNoviceSparrow],
    });

    const cardUnderTest = testEngine.getCardModel(arthurNoviceSparrow);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { arthurNoviceSparrow } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Arthur - Novice Sparrow", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: arthurNoviceSparrow.cost,
//       play: [arthurNoviceSparrow],
//     });
//
//     const cardUnderTest = testStore.getCard(arthurNoviceSparrow);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
