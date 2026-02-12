// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   RatiganGreedyGenius,
//   TheWardrobePerceptiveFriend,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ratigan - Greedy Genius", () => {
//   It("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [ratiganGreedyGenius],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(ratiganGreedyGenius);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   Describe("TIME RUNS OUT At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.", () => {
//     It("Not putting anything into inkwell", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ratiganGreedyGenius],
//       });
//
//       Expect(testEngine.getCardModel(ratiganGreedyGenius).zone).toBe("play");
//       Await testEngine.passTurn();
//       Expect(testEngine.getCardModel(ratiganGreedyGenius).zone).toBe("discard");
//     });
//
//     It("Not putting anything into inkwell", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ratiganGreedyGenius],
//         Hand: [theWardrobePerceptiveFriend],
//       });
//
//       Await testEngine.putIntoInkwell(theWardrobePerceptiveFriend);
//
//       Expect(testEngine.getCardModel(ratiganGreedyGenius).zone).toBe("play");
//       Await testEngine.passTurn();
//       Expect(testEngine.getCardModel(ratiganGreedyGenius).zone).toBe("play");
//     });
//   });
// });
//
