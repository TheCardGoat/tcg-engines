// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jujuMamaOdiesCompanion } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Juju - Mama Odie's Companion", () => {
//   It.skip("BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jujuMamaOdiesCompanion.cost,
//       Hand: [jujuMamaOdiesCompanion],
//     });
//
//     Await testEngine.playCard(jujuMamaOdiesCompanion);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
