import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { theHeadlessHorsemanRelentlessSpirit } from "./194-the-headless-horseman-relentless-spirit";

describe("The Headless Horseman - Relentless Spirit", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [theHeadlessHorsemanRelentlessSpirit],
    });

    const cardUnderTest = testEngine.getCardModel(theHeadlessHorsemanRelentlessSpirit);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theHeadlessHorsemanRelentlessSpirit } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Headless Horseman - Relentless Spirit", () => {
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theHeadlessHorsemanRelentlessSpirit],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       TheHeadlessHorsemanRelentlessSpirit,
//     );
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
