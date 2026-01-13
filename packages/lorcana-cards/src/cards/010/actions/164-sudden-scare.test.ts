// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mowgliManCub,
//   suddenScare,
//   webbyVanderquackKnowledgeSeeker,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Sudden Scare", () => {
//   it("Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: suddenScare.cost,
//         hand: [suddenScare],
//       },
//       {
//         play: [mowgliManCub],
//         deck: [webbyVanderquackKnowledgeSeeker],
//       },
//     );
//
//     await testEngine.playCard(suddenScare);
//
//     const targetCharacter = testEngine.getCardModel(mowgliManCub);
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] }, true); // Use skipAssertion
//
//     expect(testEngine.getCardModel(mowgliManCub).zone).toBe("inkwell");
//     expect(testEngine.getCardModel(webbyVanderquackKnowledgeSeeker).zone).toBe(
//       "inkwell",
//     );
//   });
// });
//
