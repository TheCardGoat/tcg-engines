import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { annaMakingSnowPlans } from "./139-anna-making-snow-plans";

describe("Anna - Making Snow Plans", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [annaMakingSnowPlans],
    });

    const cardUnderTest = testEngine.getCardModel(annaMakingSnowPlans);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { annaMakingSnowPlans } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Anna - Making Snow Plans", () => {
//   it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     const testEngine = new TestEngine({
//       play: [annaMakingSnowPlans],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(annaMakingSnowPlans);
//     expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
