import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { heiheiProtectiveRooster } from "./179-heihei-protective-rooster";

describe("HeiHei - Protective Rooster", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [heiheiProtectiveRooster],
    });

    const cardUnderTest = testEngine.getCardModel(heiheiProtectiveRooster);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { heiheiProtectiveRooster } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("HeiHei - Protective Rooster", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: heiheiProtectiveRooster.cost,
//       Play: [heiheiProtectiveRooster],
//     });
//
//     Const cardUnderTest = testStore.getCard(heiheiProtectiveRooster);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
