import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { powerlineTakingTheStage } from "./109-powerline-taking-the-stage";

describe("Powerline - Taking the Stage", () => {
  it("should have Singer 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [powerlineTakingTheStage],
    });

    const cardUnderTest = testEngine.getCardModel(powerlineTakingTheStage);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { powerlineTakingTheStage } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Powerline - Taking the Stage", () => {
//   it("Singer 4 (This character counts as cost 4 to sing songs.)", async () => {
//     const testEngine = new TestEngine({
//       play: [powerlineTakingTheStage],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(powerlineTakingTheStage);
//     expect(cardUnderTest.hasSinger).toBe(true);
//   });
// });
//
