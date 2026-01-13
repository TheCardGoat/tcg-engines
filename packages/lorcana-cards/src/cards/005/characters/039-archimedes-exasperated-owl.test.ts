import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { archimedesExasperatedOwl } from "./039-archimedes-exasperated-owl";

describe("Archimedes - Exasperated Owl", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesExasperatedOwl],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesExasperatedOwl);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { archimedesExasperatedOwl } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Archimedes - Exasperated Owl", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: archimedesExasperatedOwl.cost,
//       play: [archimedesExasperatedOwl],
//     });
//
//     const cardUnderTest = testStore.getCard(archimedesExasperatedOwl);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
