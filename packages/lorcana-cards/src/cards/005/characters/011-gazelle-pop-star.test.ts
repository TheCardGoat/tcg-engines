import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { gazellePopStar } from "./011-gazelle-pop-star";

describe("Gazelle - Pop Star", () => {
  it("should have Singer 5 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [gazellePopStar],
    });

    const cardUnderTest = testEngine.getCardModel(gazellePopStar);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { gazellePopStar } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Gazelle - Pop Star", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: gazellePopStar.cost,
//       play: [gazellePopStar],
//     });
//
//     const cardUnderTest = testStore.getCard(gazellePopStar);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
