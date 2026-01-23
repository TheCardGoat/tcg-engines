// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { judyHoppsOnTheCase } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Judy Hopps - On the Case", () => {
//   it.skip("HIDDEN CLUES When you play this character, if you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: judyHoppsOnTheCase.cost,
//       hand: [judyHoppsOnTheCase],
//     });
//
//     await testEngine.playCard(judyHoppsOnTheCase);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
