import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { kronkUnlicensedInvestigator } from "./178-kronk-unlicensed-investigator";

describe("Kronk - Unlicensed Investigator", () => {
  it("should have Challenger 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kronkUnlicensedInvestigator],
    });

    const cardUnderTest = testEngine.getCardModel(kronkUnlicensedInvestigator);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { kronkUnlicensedInvestigator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Kronk - Unlicensed Investigator", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: kronkUnlicensedInvestigator.cost,
//       play: [kronkUnlicensedInvestigator],
//     });
//
//     const cardUnderTest = testStore.getCard(kronkUnlicensedInvestigator);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
