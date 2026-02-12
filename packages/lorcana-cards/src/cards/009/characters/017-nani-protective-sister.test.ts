import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { naniProtectiveSister } from "./017-nani-protective-sister";

describe("Nani - Protective Sister", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [naniProtectiveSister],
    });

    const cardUnderTest = testEngine.getCardModel(naniProtectiveSister);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { naniProtectiveSister } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nani - Protective Sister", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [naniProtectiveSister],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(naniProtectiveSister);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
