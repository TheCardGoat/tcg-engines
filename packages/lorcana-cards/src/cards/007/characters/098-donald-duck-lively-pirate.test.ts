// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hypnotize } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { donaldDuckLivelyPirate } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song from your discard to your hand.", () => {
//   It.skip("should return an Action card that is not a song from discard to hand", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 10,
//         Play: [donaldDuckLivelyPirate],
//         Discard: [hypnotize],
//       },
//       {
//         Inkwell: 10,
//         Play: [mrSmeeBumblingMate],
//       },
//     );
//
//     //await testEngine.tapCard(donaldDuckLivelyPirate);
//
//     Await testEngine.challenge({
//       Attacker: mrSmeeBumblingMate,
//       Defender: donaldDuckLivelyPirate,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveTopOfStack({ targets: [hypnotize] });
//     Expect(testEngine.getCardModel(hypnotize).zone).toBe("hand");
//   });
// });
//
