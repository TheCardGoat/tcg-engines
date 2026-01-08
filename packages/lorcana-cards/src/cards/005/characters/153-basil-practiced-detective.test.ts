import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { basilPracticedDetective } from "./153-basil-practiced-detective";

describe("Basil - Practiced Detective", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [basilPracticedDetective],
    });

    const cardUnderTest = testEngine.getCardModel(basilPracticedDetective);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { basilPracticedDetective } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Basil - Practiced Detective", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: basilPracticedDetective.cost,
//       play: [basilPracticedDetective],
//     });
//
//     const cardUnderTest = testStore.getCard(basilPracticedDetective);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
