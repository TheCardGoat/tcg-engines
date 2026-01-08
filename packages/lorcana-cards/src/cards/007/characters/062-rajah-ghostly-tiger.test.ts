import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { rajahGhostlyTiger } from "./062-rajah-ghostly-tiger";

describe("Rajah - Ghostly Tiger", () => {
  it("should have Vanish ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rajahGhostlyTiger],
    });

    const cardUnderTest = testEngine.getCardModel(rajahGhostlyTiger);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { rajahGhostlyTiger } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Vanish (When an opponent chooses this character for an action, banish them.)", () => {
//   it("should be banished when is targeted by an action", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: 10,
//         hand: [letTheStormRageOn],
//       },
//       {
//         play: [rajahGhostlyTiger],
//       },
//     );
//
//     //await testEngine.playCard(letTheStormRageOn);
//
//     const cardTarget = testEngine.getCardModel(rajahGhostlyTiger);
//
//     await testEngine.playCard(letTheStormRageOn, {
//       targets: [rajahGhostlyTiger],
//     });
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     expect(cardTarget.isDead).toBe(true);
//   });
//
//   it("should NOT be banished when is targeted by an action from themselves", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       hand: [letTheStormRageOn],
//       play: [rajahGhostlyTiger],
//     });
//
//     const cardTarget = testEngine.getCardModel(rajahGhostlyTiger);
//
//     await testEngine.playCard(letTheStormRageOn, {
//       targets: [rajahGhostlyTiger],
//     });
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     expect(cardTarget.isDead).toBe(false);
//   });
//
//   it("should not be banished when is play an area action and damage is not greater or equal as its willpower", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: 10,
//         hand: [grabYourSword],
//       },
//       {
//         play: [rajahGhostlyTiger],
//       },
//     );
//
//     const cardTarget = testEngine.getCardModel(rajahGhostlyTiger);
//
//     await testEngine.playCard(grabYourSword);
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     expect(cardTarget.isDead).toBe(false);
//   });
// });
//
