import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { basilOfBakerStreet } from "./139-basil-of-baker-street";

describe("Basil - Of Baker Street", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [basilOfBakerStreet],
    });

    const cardUnderTest = testEngine.getCardModel(basilOfBakerStreet);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { basilOfBakerStreet } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Basil - Of Baker Street", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: basilOfBakerStreet.cost,
//
//       play: [basilOfBakerStreet],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       basilOfBakerStreet.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
