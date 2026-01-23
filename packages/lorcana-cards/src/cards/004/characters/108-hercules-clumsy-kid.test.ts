import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { herculesClumsyKid } from "./108-hercules-clumsy-kid";

describe("Hercules - Clumsy Kid", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesClumsyKid],
    });

    const cardUnderTest = testEngine.getCardModel(herculesClumsyKid);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { herculesClumsyKid } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Hercules - Clumsy Kid", () => {
//   it.skip("**Rush** _(This character can challenge the turn they're played.)_", () => {
//     const testStore = new TestStore({
//       play: [herculesClumsyKid],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       herculesClumsyKid.id,
//     );
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
