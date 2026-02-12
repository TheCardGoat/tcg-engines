// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MowgliManCub,
//   SuddenScare,
//   WebbyVanderquackKnowledgeSeeker,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sudden Scare", () => {
//   It("Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: suddenScare.cost,
//         Hand: [suddenScare],
//       },
//       {
//         Play: [mowgliManCub],
//         Deck: [webbyVanderquackKnowledgeSeeker],
//       },
//     );
//
//     Await testEngine.playCard(suddenScare);
//
//     Const targetCharacter = testEngine.getCardModel(mowgliManCub);
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] }, true); // Use skipAssertion
//
//     Expect(testEngine.getCardModel(mowgliManCub).zone).toBe("inkwell");
//     Expect(testEngine.getCardModel(webbyVanderquackKnowledgeSeeker).zone).toBe(
//       "inkwell",
//     );
//   });
// });
//
