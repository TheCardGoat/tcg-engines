import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { rajahDevotedProtector } from "./006-rajah-devoted-protector";

describe("Rajah - Devoted Protector", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rajahDevotedProtector],
    });

    const cardUnderTest = testEngine.getCardModel(rajahDevotedProtector);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { rajahDevotedProtector } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Rajah - Devoted Protector", () => {
//   it("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [rajahDevotedProtector],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(rajahDevotedProtector);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
