// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GeneralLiHeadOfTheImperialArmy,
//   KhanWarHorse,
//   StoppedChaosInItsTracks,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Stopped Chaos In Its Tracks", () => {
//   It("Return up to 2 chosen characters with 3 {S} or less each to their player's hand.", async () => {
//     Const targets = [generalLiHeadOfTheImperialArmy, khanWarHorse];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: stoppedChaosInItsTracks.cost,
//         Hand: [stoppedChaosInItsTracks],
//       },
//       {
//         Play: targets,
//       },
//     );
//
//     Await testEngine.playCard(stoppedChaosInItsTracks, { targets });
//
//     For (const target of targets) {
//       Expect(testEngine.getCardModel(target).zone).toBe("hand");
//     }
//   });
// });
//
