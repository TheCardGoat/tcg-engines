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
// import { describe, it } from "@jest/globals";
// import { heiheiProtectiveRooster } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("HeiHei - Protective Rooster", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: heiheiProtectiveRooster.cost,
//       play: [heiheiProtectiveRooster],
//     });
//
//     const cardUnderTest = testStore.getCard(heiheiProtectiveRooster);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
