// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { hypnotize } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { donaldDuckLivelyPirate } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song from your discard to your hand.", () => {
//   it.skip("should return an Action card that is not a song from discard to hand", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: 10,
//         play: [donaldDuckLivelyPirate],
//         discard: [hypnotize],
//       },
//       {
//         inkwell: 10,
//         play: [mrSmeeBumblingMate],
//       },
//     );
//
//     //await testEngine.tapCard(donaldDuckLivelyPirate);
//
//     await testEngine.challenge({
//       attacker: mrSmeeBumblingMate,
//       defender: donaldDuckLivelyPirate,
//     });
//
//     expect(testEngine.stackLayers).toHaveLength(1);
//     await testEngine.resolveTopOfStack({ targets: [hypnotize] });
//     expect(testEngine.getCardModel(hypnotize).zone).toBe("hand");
//   });
// });
//
