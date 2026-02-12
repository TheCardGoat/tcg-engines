// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { hadesLordOfTheUnderworld } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hades - Lord of the Underworld", () => {
//   It.skip("SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hadesLordOfTheUnderworld.cost,
//       Play: [hadesLordOfTheUnderworld],
//       Hand: [hadesLordOfTheUnderworld],
//     });
//
//     Await testEngine.playCard(hadesLordOfTheUnderworld);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
