import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { olafTrustingCompanion } from "./150-olaf-trusting-companion";

describe("Olaf - Trusting Companion", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [olafTrustingCompanion],
    });

    const cardUnderTest = testEngine.getCardModel(olafTrustingCompanion);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { olafTrustingCompanion } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Olaf - Trusting Companion", () => {
//   it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
//     const testStore = new TestStore({
//       play: [olafTrustingCompanion],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       olafTrustingCompanion.id,
//     );
//     expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
