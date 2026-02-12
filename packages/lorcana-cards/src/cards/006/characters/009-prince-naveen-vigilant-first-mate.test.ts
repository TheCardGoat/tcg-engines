import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { princeNaveenVigilantFirstMate } from "./009-prince-naveen-vigilant-first-mate";

describe("Prince Naveen - Vigilant First Mate", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princeNaveenVigilantFirstMate],
    });

    const cardUnderTest = testEngine.getCardModel(princeNaveenVigilantFirstMate);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princeNaveenVigilantFirstMate],
    });

    const cardUnderTest = testEngine.getCardModel(princeNaveenVigilantFirstMate);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { princeNaveenVigilantFirstMate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Prince Naveen - Vigilant First Mate", () => {
//   It.skip("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [princeNaveenVigilantFirstMate],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       PrinceNaveenVigilantFirstMate,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [princeNaveenVigilantFirstMate],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       PrinceNaveenVigilantFirstMate,
//     );
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
