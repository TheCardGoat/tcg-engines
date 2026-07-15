// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { owlPirateLookout } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Owl - Pirate Lookout", () => {
//   It.skip("WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: owlPirateLookout.cost,
//       Play: [owlPirateLookout],
//       Hand: [owlPirateLookout],
//     });
//
//     Await testEngine.playCard(owlPirateLookout);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
