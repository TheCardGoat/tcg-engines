import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { zazuAdvisorToMufasa } from "./072-zazu-advisor-to-mufasa";

describe("Zazu - Advisor to Mufasa", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [zazuAdvisorToMufasa],
    });

    const cardUnderTest = testEngine.getCardModel(zazuAdvisorToMufasa);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { zazuAdvisorToMufasa } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Zazu - Advisor to Mufasa", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: zazuAdvisorToMufasa.cost,
//       play: [zazuAdvisorToMufasa],
//     });
//
//     const cardUnderTest = testStore.getCard(zazuAdvisorToMufasa);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
