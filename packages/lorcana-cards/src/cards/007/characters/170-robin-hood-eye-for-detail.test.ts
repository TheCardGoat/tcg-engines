import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { robinHoodEyeForDetail } from "./170-robin-hood-eye-for-detail";

describe("Robin Hood - Eye for Detail", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [robinHoodEyeForDetail],
    });

    const cardUnderTest = testEngine.getCardModel(robinHoodEyeForDetail);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { robinHoodEyeForDetail } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Robin Hood - Eye for Detail", () => {
//   it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
//     const testEngine = new TestEngine({
//       play: [robinHoodEyeForDetail],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(robinHoodEyeForDetail);
//     expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
