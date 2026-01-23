import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { clawhauserDonutDetective } from "./175-clawhauser-donut-detective";

describe("Clawhauser - Donut Detective", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [clawhauserDonutDetective],
    });

    const cardUnderTest = testEngine.getCardModel(clawhauserDonutDetective);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { clawhauserDonutDetective } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Clawhauser - Donut Detective", () => {
//   it.skip("Challenger +2", async () => {
//     const testEngine = new TestEngine({
//       play: [clawhauserDonutDetective],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(clawhauserDonutDetective);
//     expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
