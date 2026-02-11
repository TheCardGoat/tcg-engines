// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { judyHoppsOnTheCase } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Judy Hopps - On the Case", () => {
//   It.skip("HIDDEN CLUES When you play this character, if you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: judyHoppsOnTheCase.cost,
//       Hand: [judyHoppsOnTheCase],
//     });
//
//     Await testEngine.playCard(judyHoppsOnTheCase);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
