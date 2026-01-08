import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { princeEricDashingAndBrave } from "./194-prince-eric-dashing-and-brave";

describe("Prince Eric - Dashing and Brave", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princeEricDashingAndBrave],
    });

    const cardUnderTest = testEngine.getCardModel(princeEricDashingAndBrave);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { princeEricDashingAndBrave } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Prince Eric - Dashing and Brave", () => {
//   it.skip("**Challenger** +2 _(While challenging, this character gets +2 {S}.)_", async () => {
//     const testEngine = new TestEngine({
//       play: [princeEricDashingAndBrave],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(princeEricDashingAndBrave);
//     expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
