import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { kakamoraBoardingParty } from "./104-kakamora-boarding-party";

describe("Kakamora - Boarding Party", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kakamoraBoardingParty],
    });

    const cardUnderTest = testEngine.getCardModel(kakamoraBoardingParty);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { kakamoraBoardingParty } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Kakamora - Boarding Party", () => {
//   it.skip("**Rush** _(This character can challenge the turn they’re played.)_", () => {
//     const testStore = new TestStore({
//       play: [kakamoraBoardingParty],
//     });
//
//     const cardUnderTest = testStore.getCard(kakamoraBoardingParty);
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
