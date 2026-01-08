import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { ladyKluckProtectiveConfidant } from "./172-lady-kluck-protective-confidant";

describe("Lady Kluck - Protective Confidant", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ladyKluckProtectiveConfidant],
    });

    const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ladyKluckProtectiveConfidant],
    });

    const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { ladyKluckProtectiveConfidant } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lady Kluck - Protective Confidant", () => {
//   it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [ladyKluckProtectiveConfidant],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   it.skip("Ward (Opponents can’t choose this character except to challenge.)", async () => {
//     const testEngine = new TestEngine({
//       play: [ladyKluckProtectiveConfidant],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
//     expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
