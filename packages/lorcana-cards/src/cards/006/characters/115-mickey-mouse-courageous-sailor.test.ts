// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mickeyMouseCourageousSailor } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Courageous Sailor", () => {
//   It.skip("SOLID GROUND While this character is at a location, he gets +2 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mickeyMouseCourageousSailor.cost,
//       Play: [mickeyMouseCourageousSailor],
//       Hand: [mickeyMouseCourageousSailor],
//     });
//
//     Await testEngine.playCard(mickeyMouseCourageousSailor);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
