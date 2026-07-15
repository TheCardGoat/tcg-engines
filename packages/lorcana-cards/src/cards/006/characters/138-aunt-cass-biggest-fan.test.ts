// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { auntCassBiggestFan } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Aunt Cass - Biggest Fan", () => {
//   It.skip("HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: auntCassBiggestFan.cost,
//       Play: [auntCassBiggestFan],
//       Hand: [auntCassBiggestFan],
//     });
//
//     Await testEngine.playCard(auntCassBiggestFan);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
