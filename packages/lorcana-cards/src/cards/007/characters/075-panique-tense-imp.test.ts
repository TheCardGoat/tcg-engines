// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { paniqueTenseImp } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Panique - Tense Imp", () => {
//   It.skip("FRIGHTENED SCREAM When you play this character, you can choose a character and move up to 2 of its damage to an opposing character of your choice.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: paniqueTenseImp.cost,
//       Hand: [paniqueTenseImp],
//     });
//
//     Await testEngine.playCard(paniqueTenseImp);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
