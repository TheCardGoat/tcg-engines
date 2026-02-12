// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { gazelleAngelWithHorns } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gazelle - Angel with Horns", () => {
//   It.skip("YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gazelleAngelWithHorns.cost,
//       Hand: [gazelleAngelWithHorns],
//     });
//
//     Await testEngine.playCard(gazelleAngelWithHorns);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
