import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { rayEasygoingFirefly } from "./092-ray-easygoing-firefly";

describe("Ray - Easygoing Firefly", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rayEasygoingFirefly],
    });

    const cardUnderTest = testEngine.getCardModel(rayEasygoingFirefly);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { rayEasygoingFirefly } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ray - Easygoing Firefly", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: rayEasygoingFirefly.cost,
//
//       play: [rayEasygoingFirefly],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       rayEasygoingFirefly.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
