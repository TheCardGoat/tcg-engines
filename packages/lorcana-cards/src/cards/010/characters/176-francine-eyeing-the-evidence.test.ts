import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { francineEyeingTheEvidence } from "./176-francine-eyeing-the-evidence";

describe("Francine - Eyeing the Evidence", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [francineEyeingTheEvidence],
    });

    const cardUnderTest = testEngine.getCardModel(francineEyeingTheEvidence);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { francineEyeingTheEvidence } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Francine - Eyeing the Evidence", () => {
//   it.skip("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
//     const testEngine = new TestEngine({
//       play: [francineEyeingTheEvidence],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(francineEyeingTheEvidence);
//     expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
