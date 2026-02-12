// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mysticalTreeMamaOdiesHome } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mystical Tree - Mama Odie's Home", () => {
//   It.skip("NOT BAD At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mysticalTreeMamaOdiesHome.cost,
//       Play: [mysticalTreeMamaOdiesHome],
//       Hand: [mysticalTreeMamaOdiesHome],
//     });
//
//     Await testEngine.playCard(mysticalTreeMamaOdiesHome);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("HARD-EARNED WISDOM At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mysticalTreeMamaOdiesHome.cost,
//       Play: [mysticalTreeMamaOdiesHome],
//       Hand: [mysticalTreeMamaOdiesHome],
//     });
//
//     Await testEngine.playCard(mysticalTreeMamaOdiesHome);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
