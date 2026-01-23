import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { daisyDuckGhostFinder } from "./141-daisy-duck-ghost-finder";

describe("Daisy Duck - Ghost Finder", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [daisyDuckGhostFinder],
    });

    const cardUnderTest = testEngine.getCardModel(daisyDuckGhostFinder);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { daisyDuckGhostFinder } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Daisy Duck - Ghost Finder", () => {
//   it.skip("Support (Whenever this character quests, you may add their to another chosen character's this turn.)", async () => {
//     const testEngine = new TestEngine({
//       play: [daisyDuckGhostFinder],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(daisyDuckGhostFinder);
//     expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
