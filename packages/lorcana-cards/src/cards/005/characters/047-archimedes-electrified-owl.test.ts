import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { archimedesElectrifiedOwl } from "./047-archimedes-electrified-owl";

describe("Archimedes - Electrified Owl", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesElectrifiedOwl],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesElectrifiedOwl);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesElectrifiedOwl],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesElectrifiedOwl);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesElectrifiedOwl],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesElectrifiedOwl);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { archimedesElectrifiedOwl } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Archimedes - Electrified Owl", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: archimedesElectrifiedOwl.cost,
//       play: [archimedesElectrifiedOwl],
//     });
//
//     const cardUnderTest = testStore.getCard(archimedesElectrifiedOwl);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
//
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: archimedesElectrifiedOwl.cost,
//       play: [archimedesElectrifiedOwl],
//     });
//
//     const cardUnderTest = testStore.getCard(archimedesElectrifiedOwl);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
//
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: archimedesElectrifiedOwl.cost,
//       play: [archimedesElectrifiedOwl],
//     });
//
//     const cardUnderTest = testStore.getCard(archimedesElectrifiedOwl);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
