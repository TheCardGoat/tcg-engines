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
// Import { describe, expect, it } from "@jest/globals";
// Import { ladyKluckProtectiveConfidant } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lady Kluck - Protective Confidant", () => {
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [ladyKluckProtectiveConfidant],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It.skip("Ward (Opponents can’t choose this character except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [ladyKluckProtectiveConfidant],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
