// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { instituteOfTechnologyPrestigiousUniversity } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Institute of Technology - Prestigious University", () => {
//   It.skip("WELCOME TO THE LAB Inventor characters get +1 {W} while here.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: instituteOfTechnologyPrestigiousUniversity.cost,
//       Play: [instituteOfTechnologyPrestigiousUniversity],
//       Hand: [instituteOfTechnologyPrestigiousUniversity],
//     });
//
//     Await testEngine.playCard(instituteOfTechnologyPrestigiousUniversity);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("PUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: instituteOfTechnologyPrestigiousUniversity.cost,
//       Play: [instituteOfTechnologyPrestigiousUniversity],
//       Hand: [instituteOfTechnologyPrestigiousUniversity],
//     });
//
//     Await testEngine.playCard(instituteOfTechnologyPrestigiousUniversity);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
