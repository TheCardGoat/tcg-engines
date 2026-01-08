import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { flotsamSlipperyAsAnEel } from "./071-flotsam-slippery-as-an-eel";

describe("Flotsam - Slippery as an Eel", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [flotsamSlipperyAsAnEel],
    });

    const cardUnderTest = testEngine.getCardModel(flotsamSlipperyAsAnEel);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { flotsamSlipperyAsAnEel } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Flotsam - Slippery as an Eel", () => {
//   it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [flotsamSlipperyAsAnEel],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(flotsamSlipperyAsAnEel);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
