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
// import { describe, expect, it } from "@jest/globals";
// import { naniProtectiveSister } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Nani - Protective Sister", () => {
//   it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
//     const testEngine = new TestEngine({
//       play: [naniProtectiveSister],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(naniProtectiveSister);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
